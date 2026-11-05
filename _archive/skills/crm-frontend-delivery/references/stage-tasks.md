# PC商机阶段任务实施手册

## QV实现地图

从`CrmOpportunity/src/components/BusinessStage.vue`、`StageConfigDialog.vue`、`StageTaskEditorDialog.vue`及`src/utils/stageTask.ts`查页面草稿、弹窗和载荷。API层只保留DTO/请求/必要原始响应转换；阶段任务与保存成功语义留业务层。若新项目由其他人负责H5消费，交付配置契约即可，不重复改其商机/跟进链。

## 草稿与DTO

下列数值是可修改的迁移样例：阶段名10、任务名15、描述选填最多50；项目首次接入必须在profile里确认，不把它当组件库限制。

```json
{
  "draft": {"taskName":"示例回访","description":"","scopeType":"CUSTOM","userIds":[],"deptIds":[],"employeeTagIds":["tag-example-1"],"limitFollowType":false},
  "taskDTO": {"name":"示例回访","description":"","userIds":[],"departmentIds":[],"employeeTagIdList":["tag-example-1"],"requiredFollowTypeId":null,"sortNo":0}
}
```

`scopeNodes/userTagList`是展示来源，不随保存DTO回传。`CUSTOM`至少一种节点非空；删除最后节点保持CUSTOM让必填校验处理，不能自动变ALL。ALL数组清空的含义需目标后端明确。已有任务ID透传，新任务不造服务端ID。

## 三层提交

任务弹窗打开隔离草稿→确定只合并阶段草稿→阶段确定合并页面草稿→底部一次提交完整阶段列表。新阶段用稳定临时key，不用数组索引判“哪一项编辑过”；取消、重新打开、排序及删除的dirty规则统一。

记录哪些阶段编辑了任务。未编辑的`taskConfigList`在请求省略；明确删除全部才传`[]`。如果已有阶段缺完整任务列表，不直接补空并放行编辑；先读完整配置或按当前旧接口只允许原有操作。客户端检查不能代替后端跨用户并发控制。

## 动态范围与失效跟进方式

选择器回显保留员工/部门/标签身份和名称；接口提供`userTagList`时按已选tagId匹配tagName，不因名称列表多项而扩大范围。保存序列化只输出原字段白名单；两层确认后未保存重开也应保留显示名。

跟进方式的“未选”“请求中”“读取失败”“已选项已失效”要分开。红框/红字失效提示只在成功加载选项后确认旧ID不存在时使用，不把请求失败渲染成选项被删除。错误选项需用户重选，不清空原任务默默保存。

## 嵌套示例与回归

有“查看示例”时按当前设计核弹窗层级和标题位置。关闭示例不关闭任务编辑器，保留输入；父弹窗关闭同步清子弹层，取消重开按产品要求重置。文字baseline、星号、按钮和范围回显一起核，不只看图。

测阶段/任务名称边界、空描述、混合范围、标签动态性、跟进选项迟到/失效、排序后编辑、清空与未编辑字段省略、保存失败保留、刷新回查。`examples/patterns.mjs`提供重写的序列化样例，必须通过真实DTO适配后才能接正式保存。
