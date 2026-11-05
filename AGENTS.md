# AGENTS.md — 捞鱼工作室官网（corporate-website）维护规范

> 本文件写给 AI agent（也为人类协作者）：在本仓库做任何更新前，先读完本规范。
> 目标：任何人/任何 AI 来更新这个站，产出风格、数据口径都保持一致。

## 站点结构（Jekyll + agency 主题）

- `_portfolio/*.md` — 作品档案（核心数据源），文件名格式：`YYYY-M-D-作品标题.md`
- `_includes/` — 首页区块模板；`projects.md` — 归档索引页（自动渲染，不要手写条目）
- `_sass/layout/*.scss` — 分组件样式；`assets/img/作品集/<作品名>/` — 作品配图
- 部署：push `main` → GitHub Actions（`.github/workflows/jekyll.yml`）自动构建上线。
  GitHub 直连失败时用代理推送：`git push https://gh-proxy.com/https://github.com/lyzbcy/corporate-website.git main`

## 新增作品（最重要）

1. **文件名日期 = 对应代码仓库的首次提交时间**（不是想法时间、不是上线时间）：
   - 本地仓库：`git log --reverse --format=%ci | head -1`
   - GitHub 仓库：API `/repos/lyzbcy/<repo>/commits?per_page=1` 读 Link 头 `rel="last"` 页取首提交
   - fork 的仓库按建档时间记（首提交属于上游作者），并在正文注明"开源项目定制分发"
   - 无仓库的作品（工作项目等）按实际开始日期，不强行对齐
2. **frontmatter 必填字段**：`title` / `subtitle` / `category` / `caption.{title,subtitle,thumbnail}` / 五维打分
3. `category` 取值：`tool`（妙妙工具）/ `personal`（个人作品）/ `school` / `team` / `work`（打工项目）

## 打分规范（五维 + 总分）

```
score_value          价值      0-100
score_difficulty     难度      0-100
score_completeness   完成度    0-100
score_innovation     创新      0-100
score_maintainability 维护性   0-100
total_score          ≈ 价值×0.25 + 完成度×0.25 + 创新×0.2 + 难度×0.15 + 维护×0.15（保留一位小数）
score_review         2-3 句评语：做了什么、强在哪、为什么没给满分
score_model          评估模型名（如 GLM-5.3、Codex（GPT-5）），谁评的写谁
```

- 不允许出现无打分的新作品（时间树/归档仍会收录，但首页精选按 `total_score` 取 top9、前 3 标 ⭐代表作，缺分会沉底）
- 打分要对得起数据：fork/搬运作品按"个人增量"给难度和创新分，并在评语说明

## 抖音视频挂载（多对多）

```yaml
douyin:
  - "7656857045957676338"   # 视频ID，可多条
```

- **一条视频可以介绍多个项目**（如 AI 项目周报视频同时挂 3 个作品）
- **一个项目可以有多条视频**
- 渲染规则：时间树/首页精选/归档角标取**第一个**视频；详情页正文把所有视频列全
- 视频链接格式：`https://www.douyin.com/video/<ID>`；封面图看板路径：`https://lyzbcy.github.io/img/douyin-covers/<ID>.jpg`（存在才可用）

## 渲染行为（改模板前先知道）

- 首页精选：`site.portfolio` 按 `total_score` 倒序取 9，前 3 加 ⭐代表作角标
- 时间树：按文件名日期倒序，四条轨迹（school/personal/team/work）可筛选
- 归档页 `/projects/`：从 frontmatter 自动生成搜索/筛选/排序，无需手维护
- 作品详情：modal 懒加载正文 + 独立页双入口，正文支持 Markdown + 内联 HTML

## 藏品库（/collection/）

- 页面 `collection.md`，数据 `_data/collection.yml`，藏品图标 `_includes/vault/<figure>.svg`，样式 `_sass/layout/_collection.scss`（在 `assets/css/agency.scss` 引入）
- 展示逻辑：items 按 `shelf` 字段自动分层上架；`placeholder: true` 是「待入库」占位展品（点击只摇晃不弹窗）
- 新增藏品的步骤：
  1. `_data/collection.yml` 的 items 里加一条（编号顺延；`figure` 指向 include 图标名；`story` 一段一条写藏品背后的故事）
  2. 复用现有 figure 或在 `_includes/vault/` 新增 SVG——**新增 SVG 里的渐变/id 必须全页唯一**（建议按藏品前缀命名，如 `vg-`、`vp-`）
  3. 藏品对应的工程归档放 `_archive/`（若为 skill 类收藏品），详情弹窗的「查看藏品全貌」按钮链到仓库归档路径
- 弹窗详情由页面内联 JS 从 `collection.yml` 渲染；入库日期、稀有度等字段缺省时对应行自动隐藏

## Skill藏品的复用验收

- 脱敏移除客户数据、内网地址、凭据与真实样本，不把目录映射、组件/字段契约、实施步骤和故障处理一起删成泛泛原则。
- 以“下载后能适配另一个同类工程”为交付目标；按实际需要带接入配置、参考文档、模板、脚本或样例。保持自包含，不引用本机私人路径或未随包发布的文档。
- 发布前把下载包解压到原工作区之外，验证接入步骤及所带脚本；区分独立样例通过与目标项目真实业务验收。源码与ZIP内容同步，线上回读文件与版本。
- 这不要求公开公司源码；可独立重写示例并参数化敏感值，保留可迁移的工程语义。

## 写作口径

- 正文结构参考现有作品：project-facts（四格速览）→ 解决什么问题 → 核心功能/关键设计 → 难点 → project-outcome（结果清单）
- 语气：第一人称、说人话、结果导向；不写营销腔
- 数字要可验证：播放量、集数、版本号来自数据看板/每日笔记，不确定就别写死
