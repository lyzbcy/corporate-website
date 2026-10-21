"""Import public product metadata and icons from a software-center checkout.

Usage: python scripts/sync-software-catalog.py <center-checkout>
Only allowlisted public display fields are exported; installer/runtime data stay out.
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]).resolve()
products = json.loads((source / 'catalog/products.json').read_text(encoding='utf-8-sig'))['products']
fields = ('id', 'name', 'summary', 'category', 'stage', 'kind', 'siteUrl')
public = []
assets = ROOT / 'assets/img/software-center'
assets.mkdir(parents=True, exist_ok=True)
for product in products:
    if product.get('private') or product.get('visibility', 'public') != 'public':
        continue
    item = {key: product[key] for key in fields if key in product}
    icon = product.get('iconImage')
    if icon:
        target = assets / Path(icon).name
        shutil.copy2(source / 'ui' / icon, target)
        item['iconImage'] = target.relative_to(ROOT).as_posix()
    public.append(item)
data = {
    'source': '捞鱼软件中心公开产品目录',
    'updated': '2026-10-21',
    'center': {'downloadUrl': 'https://github.com/lyzbcy/laoyu-software-center-downloads/releases/latest'},
    'products': public,
}
(ROOT / '_data/software.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
shutil.copy2(source / 'ui/assets/intro/laoyu-intro-adaptive.webm', assets / 'intro.webm')
shutil.copy2(source / 'ui/assets/intro/laoyu-closed.png', assets / 'brand.png')
print(f'Imported {len(public)} public products and original intro assets.')
