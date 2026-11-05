# 工作状态实施手册

## QV落点

PC功能设置`src/views/enterprise/function-setting/index.vue`，通讯录`enterprise/address/list.vue`、成员详情`address/detail.vue`，API与领域工具`src/api/workStatus.ts`和`enterprise/utils/workStatus.ts`。H5个人页`mine/components/WorkStatusBadge.vue`与`src/api/workStatus.ts`。使用权限是否有状态功能另核当前需求，不能因历史实现存在就自动加进去。

## 契约示例与差异

```json
{
  "featureEnabled": true,
  "accountBound": true,
  "accountEnabled": true,
  "canEdit": true,
  "workStatus": "ONLINE",
  "version": 0
}
```

服务状态常见`ONLINE/RESTING`，PC历史页面可能内部用1/2，由接入层显式转换。总开关也可能是通用配置`fieldMap.employeeWorkStatusOpen=0/1`；缺字段/读取失败是未知，不自动等于关闭或在线。保存配置成功可能要求解包值严格为true，不能仅HTTP200就确认。

## 状态转换

| 条件 | 展示与操作 |
| --- | --- |
| 首次查询未完成或失败、没有确认值 | 不伪造默认状态；用现有加载/失败方式，按需求隐藏入口 |
| 已有确认状态，保存中 | 显示确认值，防止重入；不显示“-”或卸载节点 |
| 更新成功且返回状态/版本完整 | 回显新确认值及版本，后台回查统计 |
| 更新失败，回查成功 | 按服务端回读恢复，不能把用户想选的值当成功 |
| 更新与回查都失败 | 保留之前确认值，禁用继续切换，按既有重试/重新进入恢复 |
| 服务端明确总开关关闭 | 按需求隐藏，清失效筛选，保留后端既有个人配置 |

包内`createConfirmedStatus`只演示确认值和失败保留，权限和UI显隐仍由页面按实际字段组合；它不替代服务端授权。

## 名单分页与计数

优先消费原名单`records`下发的`workStatus/version`，筛选通过`workStatusList`交服务端；筛选变化回第一页，清空按协议省略。不要分页后仅过滤当前页，不为补下拉人数发三次重复列表请求。

典型`workStatusCount={all,online,resting}`口径：统计保留部门、账号、权限等其他条件，但忽略当前工作状态筛选及分页。`all`可能包含没有有效状态的人，故不一定等于online+resting；不能把差额直接报后端bug。账号状态统计不是工作状态统计，接口改版要逐字段核对。

## UI和验证

PC保存后保留行/row-key与筛选，只抑制这次后台刷新不必要的整表遮罩；正常首屏、翻页和筛选仍用原loading。成员详情对齐测label、开关和文字中心；开关若为销售管理子项，核父关闭显隐和原值保留，不误改父开关保存事件。

正常休息→在线、版本0、无资格、总开关关闭、慢回查、双失败、离页迟到分别测。观察节点卸载/短横线/整表遮罩；只模拟浏览器不宣布真企微客户端通过。共享开关测试须按授权记录并恢复。
