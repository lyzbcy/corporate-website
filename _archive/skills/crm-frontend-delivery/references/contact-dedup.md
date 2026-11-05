# 联系人查重与协作实施手册

## QV入口与适配职责

PC从`CrmSalesManagementSettings/.../DuplicateCheckSettings.vue`查配置；H5从`CrmContactToAdd`查创建编排、重复结果弹层及`api/collaboration.ts`。接口按`contact.repeatDetail`与`contact.joinCooperation`别名映射到目标服务，URL留在目标API层；主表单调用业务适配器，不把查重UI写进基础request。

## 对齐请求与响应

下面是字段形状和虚构数据，不绑定接口地址。适配器负责把目标字段转成页面明确语义。

```json
{
  "request": {"scene":"CREATE","list":[{"fieldKey":"contactName","fieldValue":"示例联系人","fieldName":"姓名"}],"needOwnerConversation":true},
  "response": {"repeatHit":true,"repeatToken":"example-token-not-valid","expireAt":"2099-01-01T00:00:00Z","policy":{"allowBecomeCooper":true,"scopeMatched":true},"items":[{"contactId":"contact-example-1","inOpenSea":false,"canBecomeCooper":true,"owner":{"name":"示例成员","canStartChat":false}}]}
}
```

核目标接口的CREATE/UPDATE语义；UPDATE若要求contactId则保留。凭证只用于同一轮输入快照、同一租户和场景，按目标协议解析有效期，不能靠“字符串非空”判断。合成token不得发真实接口。

## 接入步骤

1. 点击现有确认按钮后做字段校验并取得提交快照，记录会话与修订号；不要未经需求又加失焦查重弹层。
2. 调详细查重。响应不明确/失败即中断；`repeatHit=false`才按当前协议创建。命中时停止普通创建，显示对应联系人或公海卡片。
3. 加入按钮同时核当前策略范围及该条`canBecomeCooper`，公海/负责人/无权限分支按当前需求展示，不能仅“有token”就允许加入。
4. `becomeCooper`只使用这轮结果中的contactId和凭证。成功只接受实际协议明确成功，例如解包后的`success=true`；`ALREADY_EXISTS`是否视为成功也需契约确认。随后打开相同联系人，独立回查协作关系与负责人。
5. 输入、模式或关联企业变化立即使旧命中/凭证失效；过期后重新查重，不复用上次结果。取消弹层保留或重置哪些草稿按产品约定。
6. 保存/加入确认真实成功后先处理缓存失效、原会话完成标记，再做旧UI隔离。见`examples/patterns.mjs`的`createSubmissionSession`；它不保证后端幂等。

## 配置页

核企业模式/联系人模式下可选查重字段与允许加入范围。员工标签保存规则ID，不把动态标签展开为当前成员。显示名从当前配置返回或既有选择器解析；失败不伪装为空范围。保存后回读同一配置，不自动改为全员。

## 最少回归

未命中创建一次；命中有权加入；命中无权不写；取消；凭证过期；查重期间输入变化；旧回包晚到；写成功期间改输入后二次点击不重复写；失败允许重试；旧会话成功不终结新表单。接口命中、加入及独立详情回读分别留证，不以管理员通过替代普通员工。
