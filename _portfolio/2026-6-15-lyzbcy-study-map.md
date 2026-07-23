---
title: lyzbcy-study-map
subtitle: 把难啃文稿、课程与真题拆成有原文依据、能追问、能复述的交互式理解地图
image: assets/img/作品集/lyzbcy-study-map/理解地图实例.png
alt: lyzbcy-study-map 生成的行测速通理解地图实例
category: tool
tags: [妙妙工具, AI技术, Agent Skill, 学习工具, 知识可视化]
featured: true

caption:
  title: lyzbcy-study-map
  subtitle: Source-grounded Learning Map
  thumbnail: assets/img/作品集/lyzbcy-study-map/理解地图实例.png
total_score: 89.0
score_value: 88
score_difficulty: 88
score_completeness: 92
score_innovation: 90
score_maintainability: 86
score_review: "它把原文保真、结构识别、闭环互动、错题回流、手把手计算演示和静态网页交付整合成可复用 Skill，并已有真实理解地图实例与公开仓库。固定互动契约、完整自检清单和 MIT 许可提升了可维护性；但不同学科的内容质量仍依赖源材料与生成过程，因此没有给出满分。"
score_model: "Codex（GPT-5）"
---

<div class="q-bounce-content" markdown="1">

> 目标不是“轻松看完”，而是“准确理解”：知道作者在回答什么、每个判断依据在哪里，以及自己究竟有没有学会。

<div class="project-facts">
  <div class="project-fact"><span>首次提交</span><strong>2026 年 6 月 15 日</strong></div>
  <div class="project-fact"><span>项目形态</span><strong>Agent Skill + 自包含 HTML</strong></div>
  <div class="project-fact"><span>核心结构</span><strong>11 个理解与复盘模块</strong></div>
  <div class="project-fact"><span>开源许可</span><strong>MIT License</strong></div>
</div>

## 它解决什么问题

很多深度材料难读，不是每句话都看不懂，而是读者容易丢失论证结构：作者真正想回答的问题、事实与判断的边界、核心概念之间的关系，以及下一步该追问什么。

`lyzbcy-study-map` 会把技术长文、访谈、论文、课程章节和真题，转换成一份 **source-grounded** 的交互式理解地图。每个核心判断都要绑定原文依据，模型补充的解释必须和作者观点分开。

## 输出不是摘要，而是一条学习闭环

<ol class="project-flow">
  <li><strong>保真拆解</strong><br>识别原文问题与结构，区分事实、判断、推论和例子，避免强行套因果。</li>
  <li><strong>零基础补齐</strong><br>只补读懂材料真正需要的背景概念，并明确标注为辅助解释。</li>
  <li><strong>互动检查</strong><br>用单选、多选、判断、匹配和排序题检查理解，答错后给出依据与回流位置。</li>
  <li><strong>课程增强</strong><br>课程与真题场景加入逐步计算演示、真题蒸馏和复习缺口定位。</li>
  <li><strong>可交付页面</strong><br>生成无需后端的 HTML，带导航、进度、错题回流与可复制学习报告。</li>
</ol>

## 关键设计

### 11 模块内容骨架

学习目标、零基础背景包、原文问题定位、原文结构地图、核心判断与依据、关键概念拆解、苏格拉底式阅读关卡、闯关任务、误解与边界、背景知识缺口、复盘与学习报告，形成从理解到验证的完整路径。

### 固定互动契约

题目只使用能自动检查的闭环题型，通过固定 `data-*` 契约与事件委托引擎统一处理。每题必须能点击、能反馈、能记录，避免“页面看起来很完整，但按钮没有反应”。

### 数据驱动与静态交付

章节数、题目数和进度等统计从页面数据结构动态计算，不靠手写数字。页面可直接本地打开，也能发布到 GitHub Pages；更新机制通过页面版本号与 `version.json` 对比，降低静态缓存导致的旧内容问题。

### 语义化表情推广

<div class="study-map-sticker-proof">
  <img src="{{ site.baseurl }}/assets/img/作品集/微信表情包/精选/study.png" alt="一起学习">
  <img src="{{ site.baseurl }}/assets/img/作品集/微信表情包/精选/cheer.png" alt="加油">
  <img src="{{ site.baseurl }}/assets/img/作品集/微信表情包/精选/idea.png" alt="灵机一动">
  <p>表情不是装饰贴纸，而是按“开始学习—答题反馈—完成复盘”的语义放到真实触点中；图片全部复制到项目内自托管。</p>
</div>

## 代表作

- [操作系统极速备考 · 理解地图](https://lyzbcy.github.io/os-study/)：围绕操作系统课程与真题，提供章节地图、手把手计算演示、互动检查、错题回流和学习报告。
- [微盛学习地图](https://lyzbcy.github.io/weshoto-study/)：将企业培训材料拆成可导航、可自测、可复盘的交互式学习页面。

## 已验证的交付形态

- 已生成行测、申论、操作系统备考和企业培训等多类理解地图；
- 实例具备左侧固定导航、右侧单列学习区、互动题、进度和学习报告；
- 支持可选的后台语音播报与逐句字幕，但只有用户明确需要时才启用；
- 公开仓库：[GitHub 源码](https://github.com/lyzbcy/lyzbcy-study-map)。

<div class="project-outcome" markdown="1">

**核心结果**：把“请帮我总结”升级为一套可检查、可追问、可复述的学习工作流，并沉淀为能被其他 Agent 重复调用的公开 Skill。

</div>

</div>
