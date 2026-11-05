---
name: crm-frontend-delivery
description: 将CRM联系人查重、客户阶段、员工工作状态、H5关联企业及PC商机任务配置迁移到其他QV-Admin/QV-Admin-H5或同类Vue工程。带真实目录适配地图、模块实施手册、DTO示例、Options API组件接入、项目初始化脚本、回归用例和可运行异步状态样例。
metadata:
  version: "1.1.0"
---

# QV CRM 开发与联调迁移包

本包保留一个QV-Admin/QV-Admin-H5项目中可复用的模块结构、字段语义、实施流程和故障处理。客户资料、实际域名、凭据、业务样本及原始截图不随包发布；QV目录名、微盛组件名、DTO字段及状态枚举保留。示例代码为独立重写的教学实现，不是公司业务源码，也不是整套CRM。

## 下载后如何接到另一个项目

1. 让Agent读本文件与[QV接入地图](references/qv-adapter.md)。复制[接入配置](templates/qv-profile.example.json)，填目标工程的模块位置、负责人、接口别名和规则差异。旧项目的字数和状态策略是候选，不自动成为新需求。
2. 先预览目录核对（命令中的路径替换为自己的目录；Python 3.10+）：

```sh
python <技能目录>/scripts/bootstrap_project.py --profile <接入配置.json> --pc-root <PC仓库> --h5-root <H5仓库>
```

默认只输出检查结果，不写文件。确认映射后加`--apply`，在PC根目录（只提供H5时用H5根目录）的`.crm-adaptation/`生成项目地图、契约核对表、实施计划、回归CSV和接入配置副本；**不覆盖已有记录、不修改业务源码、不请求网络**。只提供一端时，另一端标为未提供，不冒充检查通过；本轮确实不需要的端及操作从自己的profile移除。

3. 按下面的模块手册，在目标仓库完成“发现现状→核契约→实现→反例→真实回读”；不能只把初始化文档生成就记成功。
4. 跑包内可执行样例，理解再接业务（Node.js 18+、Python 3.10+；均无第三方依赖）：

```sh
node --test <技能目录>/tests/patterns.test.mjs
python <技能目录>/tests/test_bootstrap.py
```

上述是独立样例与初始化器验证，不需要公司依赖或登录，不等于目标项目接口/页面验收。

## 模块实施入口

| 任务 | 必读资料与产物 |
| --- | --- |
| 先识别工程与组件 | [QV目录/组件接入](references/qv-adapter.md)、[配置模板](templates/qv-profile.example.json) |
| 查重规则、命中弹层、成为协作人 | [查重与协作实施](references/contact-dedup.md) |
| 客户阶段、完整编辑载荷、停用历史 | [客户阶段实施](references/customer-stage.md) |
| PC名单、成员详情、H5状态胶囊 | [工作状态实施](references/work-status.md) |
| 企业模式/关联模式、企业名异步校验 | [H5关联企业实施](references/company-association.md) |
| PC阶段任务、选择器回显、嵌套草稿 | [阶段任务实施](references/stage-tasks.md) |
| 在新需求中复用规则 | [范围与契约](references/scope-and-contracts.md)、[草稿与异步](references/drafts-and-async.md) |
| 验证/精确撤回/灰度交付 | [交付手册](references/verification-and-delivery.md)、[回归CSV](templates/regression-cases.csv) |

## 执行中的约束

沿目标仓库的Options API、组件库、目录和异常处理方式实现。修改共享文件先定位具体业务片段；公司项目依赖版本由目标工程确认，不从本包安装或固定旧版本。功能开关消费现有公共能力，不新增重复Vuex或全局初始化。

当前分工写入生成的项目地图；若某模块不归当前任务，就保留地图与证据，不修改。脚本只做接入准备，不授权提交、合并、发消息或改共享配置。目标接口的URL/租户/登录材料仅在目标环境配置，公开包不要求提供或上传。

## 新项目完成一项功能的最小闭环

列出拟改文件及负责人→确认当前DTO与组件契约→补技术方案和接口映射→改最小业务增量→验证正常、失败、旧响应及取消→真实保存并重新打开回读→清理专用样本→按授权提交并核运行版本。只读或UI调整按实际影响缩小验证，不无意义做共享写入。

输出实现位置、接口差异、实际请求/回读、未覆盖项及交付阶段。金额、商品、公海自动分配等相邻功能不因同页使用就自动纳入任务。示例辅助方法见[patterns.mjs](examples/patterns.mjs)，输入和限制在文件头及各手册中注明；不把测试样例当成可直接替换所有生产逻辑的SDK。
