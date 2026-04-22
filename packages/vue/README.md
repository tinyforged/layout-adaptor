# @tinyforged/layout-adaptor-vue

`@tinyforged/layout-adaptor` 的 Vue 3 集成包，提供 Composable Hook 和 Provider 组件。

> 内置 `@tinyforged/layout-adaptor` 作为依赖，无需单独安装。

## 安装

```bash
pnpm add @tinyforged/layout-adaptor-vue
```

## useLayoutAdaptor

Composable Hook，自动管理适配器生命周期。

```vue
<script setup>
import { useLayoutAdaptor } from "@tinyforged/layout-adaptor-vue";

const { scale, update, enable, disable } = useLayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain",
  resize: true,
});
</script>
```

### 返回值

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `scale` | `Ref<number>` | 当前缩放比例 |
| `started` | `Ref<boolean>` | 是否已启动 |
| `adaptor` | `Ref<LayoutAdaptor>` | 适配器实例 |
| `adaptMode` | `Ref<AdaptMode>` | 当前适配模式 |
| `direction` | `Ref<Direction>` | 当前缩放方向 |
| `activeBreakpoint` | `Ref<BreakpointConfig \| null>` | 当前激活的断点 |
| `disabled` | `Ref<boolean>` | 是否禁用 |
| `update(options)` | `Function` | 更新配置 |
| `setAdaptMode(mode)` | `Function` | 切换适配模式 |
| `setDirection(dir)` | `Function` | 切换缩放方向 |
| `enable()` | `Function` | 启用 |
| `disable()` | `Function` | 禁用 |
| `on(event, listener)` | `Function` | 监听事件 |
| `off(event, listener)` | `Function` | 取消监听 |

## LayoutAdaptorProvider

Provider 组件，通过 Props 配置，子组件通过 `useLayoutAdaptorInject` 获取适配器状态。

```vue
<script setup>
import { LayoutAdaptorProvider } from "@tinyforged/layout-adaptor-vue";
</script>

<template>
  <LayoutAdaptorProvider
    design-width="1920"
    design-height="1080"
    target="#app"
    fit-mode="contain"
    :resize="true"
    @scale-change="onScale"
  >
    <YourContent />
  </LayoutAdaptorProvider>
</template>
```

### Props

与 `LayoutAdaptorOptions` 一致，支持 `designWidth`、`designHeight`、`target`、`fitMode`、`adaptMode`、`direction`、`resize`、`transition`、`overflow`、`minScale`、`maxScale`、`breakpoints`、`debug`、`disabled` 等。

### Events

`scale-change` / `resize` / `render` / `start` / `stop` / `ready` / `error` / `adapt-mode-change` / `breakpoint-change` / `direction-change` / `before-render`

## useLayoutAdaptorInject

在 Provider 内部子组件中使用，获取共享的适配器状态。

```vue
<script setup>
import { useLayoutAdaptorInject } from "@tinyforged/layout-adaptor-vue";

const { scale, setAdaptMode } = useLayoutAdaptorInject();
</script>
```

## License

MIT
