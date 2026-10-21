"""One-time, non-overwriting backfill. Dates verified against first Git commits."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
products = {p['id']: p for p in json.loads((root / '_data/software.json').read_text(encoding='utf-8'))['products']}
entries = [
    ('center', '2026-09-29', '捞鱼软件中心', [90,85,86,75,84], '把分散的软件、创作工具和学习入口，收进一个桌面工作台。', '发现、下载校验、软件关联与更新形成统一入口；跨平台产品的安装与使用体验仍需持续验证。'),
    ('xuhuohua', '2026-09-09', '自动续火花', [78,76,80,65,72], '把续火花任务放到同一个工作台，减少每天重复打开会话、寻找对象和确认状态的操作。', '集中管理续火花任务，已有公开版本。实际体验依赖平台登录状态与规则变化，仍需持续维护适配。'),
    ('laoyu-sync', '2026-09-07', '捞鱼同步小助手', [84,75,75,62,74], '电脑之间同步文件时，我需要更直观的中文引导，也希望随时看见同步是否正常。', '通过中文引导与桌面小鱼呈现同步状态，面向多电脑协作。当前仍为内测版，复杂冲突和多设备边界需要继续打磨。'),
    ('laoyu-screen-switch', '2026-10-04', '捞鱼屏幕开关', [76,60,86,50,80], '有时只想关掉屏幕，让电脑继续运行下载或其他任务。这个工具把关屏与亮屏做成可配置的快捷操作。', '提供快捷键、系统待机与黑屏遮罩等关屏方式，并有公开下载。功能范围明确，不同显示设备的行为仍需验证。'),
    ('paid-to-watch', '2026-06-09', '捞鱼桌脚看电视', [68,68,78,65,68], '把本地视频或网页放进桌面上的软件推荐卡片里，需要时用老板键遮挡并静音。', '围绕卡片播放、网页入口与快捷遮挡形成完整小工具。网页播放受站点策略影响，可用性需要跟随外部变化维护。'),
    ('laoyu-disk-cleaner', '2026-10-13', '捞鱼C盘清理大师', [85,78,80,60,76], 'C 盘快满时，我更想先知道空间究竟被什么占用，再决定哪些当前用户缓存可以清理。', '先查看真实磁盘占用，再审查缓存并选择清理。价值在可检查、可选择的操作流程，后续仍需覆盖更多软件缓存与环境。'),
    ('general-knowledge', '2026-06-29', '通识知识地图', [75,60,74,62,70], '把分散的通识知识按主题连接起来，让阅读从单个概念延伸到它的上下文。', '提供按主题探索的在线知识入口，帮助建立整体框架。内容覆盖和长期更新仍有提升空间。'),
    ('computer-knowledge', '2026-07-01', '计算机知识地图', [78,65,76,63,72], '学习计算机时，零散概念常常记得住名字，却连不成体系。我把知识组织成一张可以探索的地图。', '把计算机知识连接成可浏览的学习框架。知识地图的价值依赖内容准确性与持续修订，目前仍需要逐步补齐深度。'),
    ('os-study', '2026-06-22', '操作系统学习', [76,58,76,55,68], '复习操作系统时，我想把课程重点和概念关系放在一起，方便反复回看和查漏补缺。', '提供操作系统课程学习与复习入口，围绕重点梳理知识。学习效果还需要结合做题和课程材料检验。'),
]
for pid, date, title, scores, problem, review in entries:
    product = products.get(pid, {})
    value, difficulty, completeness, innovation, maintainability = scores
    score = round(value*.25 + completeness*.25 + innovation*.2 + difficulty*.15 + maintainability*.15, 1)
    image = product.get('iconImage', 'assets/img/software-center/brand.png' if pid == 'center' else '')
    url = product.get('siteUrl', 'https://github.com/lyzbcy/laoyu-software-center-downloads/releases/latest')
    meta = {
        'title': title, 'subtitle': product.get('summary', '发现、下载与打开捞鱼的软件和工具'),
        'category': 'tool', 'tags': [product.get('category', '桌面效率'), product.get('stage', '公开发布')],
        'product_id': pid, 'image': image, 'alt': title,
        'caption': {'title': title, 'subtitle': product.get('category', 'Laoyu Software Center'), 'thumbnail': image},
        'score_value': value, 'score_difficulty': difficulty, 'score_completeness': completeness,
        'score_innovation': innovation, 'score_maintainability': maintainability,
        'total_score': score, 'score_review': review, 'score_model': 'Codex（GPT-6）',
    }
    if pid == 'center':
        meta['permalink'] = '/software-center/'
    if not image:
        meta.pop('image')
        meta['caption'].pop('thumbnail')
    y, m, d = date.split('-')
    target = root / '_portfolio' / f'{y}-{int(m)}-{int(d)}-{title}.md'
    if target.exists():
        continue
    body = f'''\n<div class="project-facts" markdown="1">\n\n- **开始日期**：{date}（仓库首个提交，北京时间）\n- **当前形态**：{product.get('stage', '公开发布')}\n- **产品入口**：[查看{title}]({url})\n\n</div>\n\n## 为什么做这个项目\n\n{problem}\n\n## 核心设计\n\n{product.get('summary', '按用途发现软件、准备并校验下载文件、识别与关联本机程序，在一个窗口里打开常用工具。软件中心公开目录包含桌面效率、内容创作、开发工具、AI Skills、学习与趣味五类用途。')}\n\n## 难点与维护\n\n{review}\n\n<div class="project-outcome" markdown="1">\n\n## 当前结果\n\n已作为独立工具入口收录到[官网产品库]({{{{ site.baseurl }}}}/#software-library)，也可以从捞鱼软件中心发现它。具体版本、平台要求和使用方法，以产品入口内的发布说明为准。\n\n</div>\n'''
    if pid == 'center':
        body += '''\n## 一个入口，连接日常所需\n\n公开发布页提供 Windows 安装版与便携版、macOS Apple 芯片与 Intel 包。软件中心支持的产品可进行下载与文件校验，保留各自的发布记录与使用指南；本机软件支持自动识别与手动关联。\n\n软件中心的原版开屏使用蓝金流光勾勒原创捞鱼形象。这次官网沿用同一份视频作为首屏叠加背景，提供暂停开关，并响应系统减少动态效果设置。\n'''
    target.write_text('---\n' + json.dumps(meta, ensure_ascii=False, indent=2) + '\n---\n' + body, encoding='utf-8')
    print(target.name)
