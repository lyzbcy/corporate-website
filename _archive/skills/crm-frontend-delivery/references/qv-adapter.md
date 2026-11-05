# 接入其他 QV 工程

## 这次保留什么、替换什么

保留QV模块名、Options API形式、`@wshoto/pc-base-ui`/`@wshoto/h5-base-ui`/`@wshoto/lib-base`接入点、常见DTO字段、状态机及实际踩坑。替换客户名称、成员/租户/业务ID、域名、凭据、具体发布分支和截图。模块位置是已走过的实现地图，目标版本可能搬迁，先查文件再应用，不自动创建一套同名功能。

## 在新仓库先做一次定位

```sh
rg --files packages src | rg 'DuplicateCheckSettings|CrmContactToAdd|customerStage|WorkStatusBadge|BusinessStage|ChooseCompany'
rg -n 'checkRepeatDetail|becomeCooper|employeeWorkStatusOpen|workStatusList|customerStageDTO|taskConfigList|contactCompanyRelationOpen' packages src
```

`rg`不存在时用工程搜索。结果对照`templates/qv-profile.example.json`：PC设置主要在`packages`，企业功能与通讯录仍在`src/views/enterprise`；H5新联系人入口和联系人字段表单不是同一职责。`CrmContactToAdd`编排查重/创建/加入，`ContactCreateForm`负责字段组件，不把成功会话锁随意移进通用表单。

PC路径通常以`/`为路由基准，H5常以`/workbench/`为基准；先读当前路由配置和实际请求，不从旧端口、旧lane或UA模拟推断正确环境。

## QV组件用法

以下是接入形状，使用前读目标工程安装版类型和同类调用。包版本、选择器具体props及注册方式按目标版本确认。

```vue
<template>
  <ws-dialog v-model:visible="visible" title="阶段任务">
    <ws-button type="text" @click="scopeVisible = true">请选择</ws-button>
    <template #footer>
      <ws-button @click="cancel">取消</ws-button>
      <ws-button type="primary" :loading="saving" :disabled="!ready" @click="save">确定</ws-button>
    </template>
  </ws-dialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { WsDialog, WsButton } from '@wshoto/pc-base-ui';
// 在目标页面的Options API组件中合并注册及现有状态/方法；不是完整可运行组件。
export default defineComponent({ components: { WsDialog, WsButton } });
</script>
```

- 普通按钮`WsButton`，操作列核`WsOperation/WsOperationGroup`，表格核`WsTable`；文本按钮用目标组件支持的`type="text"`，不机械带`link`。
- `WsTable`中的`el-table-column`可能是正式支持方式，不能批量替换；分页默认值、row-key与局部loading读实际契约。
- 员工选择器应保留员工、部门、员工标签的节点类型和名称，回显接已有选择器；不能用“已选N项”掩盖丢失的节点信息。
- H5保留已有Vant/微盛组件用法、确认弹窗和键盘/触摸防重入；跨路由关闭残留弹层，核Teleport目标。组件免导入是否启用以目标工程为准。

## 第一轮接入应产出

`.crm-adaptation/project-map.md`记录实际仓库、找到/缺失路径和负责人；`contract-checklist.md`记录接口别名到实际服务的映射、状态码/返回包装、长ID、开关和权限语义；`implementation-plan.md`只列当前任务的改动，不照搬原项目临时分工。缺接口或路径记为待核，不假造地址或返回成功。每个实际需要的operation填目标adapter并在核对协议后增加`confirmedForTarget: true`；本次不需要的操作或端从自己的profile中移除。只有路径、负责人、规则和契约均已明确，初始化器才标记可开始实现，它仍不代表业务测试通过。
