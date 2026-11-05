#!/usr/bin/env python3
"""Inspect QV mappings; optionally seed local planning docs. Never edits business files."""
import argparse
import json
from pathlib import Path, PurePosixPath

SKILL = Path(__file__).resolve().parents[1]


def relative_path(value):
    if not isinstance(value, str) or not value or '\\' in value or ':' in value:
        raise ValueError('mapping/output must be a non-empty relative POSIX path')
    path = PurePosixPath(value)
    if path.is_absolute() or '..' in path.parts or '.git' in path.parts or 'node_modules' in path.parts:
        raise ValueError('unsafe relative path: ' + value)
    return path


def load_profile(path):
    data = json.loads(Path(path).read_text(encoding='utf-8-sig'))
    if data.get('schemaVersion') != 1 or not isinstance(data.get('projectName'), str):
        raise ValueError('expected schemaVersion=1 and projectName')
    if not isinstance(data.get('targets'), dict) or not data['targets']:
        raise ValueError('targets must contain at least one target')
    for side, target in data['targets'].items():
        if side not in ('pc', 'h5') or not isinstance(target, dict) or not isinstance(target.get('files'), dict) or not target['files']:
            raise ValueError('targets support pc/h5 with files mappings')
        for value in target['files'].values():
            relative_path(value)
    if not isinstance(data.get('owners', {}), dict) or not isinstance(data.get('operations', {}), dict):
        raise ValueError('owners and operations must be mappings')
    for operation in data.get('operations', {}).values():
        if not isinstance(operation, dict) or not isinstance(operation.get('adapter', ''), str):
            raise ValueError('operation must contain an adapter string')
    return data


def inspect(profile, roots):
    rows = []
    for side, target in profile['targets'].items():
        root = roots.get(side)
        if root is not None and not root.is_dir():
            raise ValueError('target directory does not exist: ' + str(root))
        for name, value in target['files'].items():
            path = None if root is None else (root / value).resolve()
            if path is not None and not path.is_relative_to(root):
                raise ValueError('mapping resolves outside target root: ' + value)
            rows.append({'side': side, 'module': name, 'path': value,
                         'status': 'not-provided' if root is None else 'found' if path.is_file() else 'missing'})
    warnings = []
    if profile.get('rules', {}).get('confirmedForTarget') is not True:
        warnings.append('Sample business rules are not confirmed for this target.')
    for name, owner in profile.get('owners', {}).items():
        if not owner or '待确认' in str(owner):
            warnings.append('Owner not confirmed: ' + name)
    for alias, operation in profile.get('operations', {}).items():
        if not operation.get('adapter') or '待映射' in operation['adapter'] or operation.get('confirmedForTarget') is not True:
            warnings.append('Contract adapter not confirmed: ' + alias)
    return {'project': profile['projectName'], 'files': rows, 'warnings': warnings,
            'readyForImplementation': not warnings and all(x['status'] == 'found' for x in rows)}


def documents(profile, report):
    rows = ['# Project map', '', '# ' + profile['projectName'], '',
            '目录存在只说明找到文件，不说明接口/权限/需求已经验证。', '',
            '| Side | Module | Path | Discovery |', '| --- | --- | --- | --- |']
    rows += [f"| {r['side']} | {r['module']} | `{r['path']}` | {r['status']} |" for r in report['files']]
    rows += ['', '## Owners', ''] + [f'- {name}: {owner}' for name, owner in profile.get('owners', {}).items()]
    rows += ['', '## Items to confirm', ''] + ['- ' + w for w in report['warnings']]
    contract = ['# Contract checklist', '', '实际URL/登录材料只留在目标工程配置。下列是别名，不是可调用地址。', '',
                '| Alias | Target adapter | Success | Fields | Status |', '| --- | --- | --- | --- | --- |']
    for alias, item in profile.get('operations', {}).items():
        fields = ', '.join(item.get('fields', []))
        status = '映射已确认，真实请求待测' if item.get('confirmedForTarget') is True else '未核验'
        contract.append(f"| {alias} | {item.get('adapter', '待映射')} | {item.get('success', '待核')} | {fields} | {status} |")
    contract += ['', '## Cross-cutting checks', '', '- 真实前端资源/后端环境/租户角色一致。',
                 '- ID解码、版本0、失败与缺省/清空语义。', '- 统一异常与服务端授权。', '- 保存后回读及共享数据恢复。']
    return {'project-map.md': '\n'.join(rows) + '\n',
            'contract-checklist.md': '\n'.join(contract) + '\n',
            'implementation-plan.md': (SKILL / 'templates/implementation-plan.md').read_text(encoding='utf-8'),
            'regression-cases.csv': (SKILL / 'templates/regression-cases.csv').read_text(encoding='utf-8'),
            'adapter-profile.json': json.dumps(profile, ensure_ascii=False, indent=2) + '\n',
            'discovery.json': json.dumps(report, ensure_ascii=False, indent=2) + '\n'}


def bootstrap(profile_path, pc_root=None, h5_root=None, apply=False, output_dir='.crm-adaptation'):
    profile = load_profile(profile_path)
    pc = None if pc_root is None else Path(pc_root).resolve()
    roots = {'pc': pc, 'h5': None if h5_root is None else Path(h5_root).resolve()}
    primary = pc if pc is not None else roots['h5']
    if primary is None or not primary.is_dir():
        raise ValueError('provide an existing PC or H5 root')
    report = inspect(profile, roots)
    relative_path(output_dir)
    output = (primary / output_dir).resolve()
    if output == primary or not output.is_relative_to(primary):
        raise ValueError('output directory must stay inside the primary target root')
    report['mode'] = 'apply' if apply else 'preview'
    report['output'] = str(output)
    report['written'] = []
    report['preservedExisting'] = []
    if apply:
        content = documents(profile, report)
        output.mkdir(parents=True, exist_ok=True)
        for name, body in content.items():
            dest = output / name
            if dest.exists() or dest.is_symlink():
                report['preservedExisting'].append(name)
                continue
            # Exclusive creation also protects an existing file created during this run.
            try:
                with dest.open('x', encoding='utf-8', newline='') as stream:
                    stream.write(body)
                report['written'].append(name)
            except FileExistsError:
                report['preservedExisting'].append(name)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile', default=str(SKILL / 'templates/qv-profile.example.json'))
    parser.add_argument('--pc-root')
    parser.add_argument('--h5-root')
    parser.add_argument('--output-dir', default='.crm-adaptation')
    parser.add_argument('--apply', action='store_true', help='create planning docs only; preserve all existing files')
    args = parser.parse_args()
    try:
        report = bootstrap(args.profile, args.pc_root, args.h5_root, args.apply, args.output_dir)
    except (ValueError, OSError, json.JSONDecodeError) as error:
        parser.exit(2, str(error) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
