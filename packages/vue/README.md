# @tinyforged/layout-adaptor-vue

`@tinyforged/layout-adaptor` 的 Vue 3 集成包，提供 Composable Hook 和 Provider 组件。

> 内置 `@tinyforged/layout-adaptor` 作为依赖，无需单独安装。

## 安装

```bash
pnpm add @tinyforged/layout-adaptor-vue
```

## useLayoutAdaptor

Composable Hook，自动管理适配器的挂载与卸载生命周期。支持传入 Vue `ref` 作为目标元素。

### 基本用法

```vue
<template>
  <div ref="containerRef">
    <h1>数据大屏</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLayoutAdaptor } from "@tinyforged/layout-adaptor-vue";

const containerRef = ref<HTMLElement>();

const { scale, started } = useLayoutAdaptor({
  target: containerRef,
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain",
  resize: true,
});
</script>
```

也支持 CSS 选择器字符串：

```vue
<script setup lang="ts">
import { useLayoutAdaptor } from "@tinyforged/layout-adaptor-vue";

const { scale } = useLayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
});
</script>
```

### 动态更新配置

```vue
<script setup lang="ts">
const { update, disable, enable, setAdaptMode } = useLayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
});

// 运行时更新设计稿尺寸
function switchTo720p() {
  update({ designWidth: 1280, designHeight: 720 });
}

// 切换适配策略
setAdaptMode("rem");

// 临时禁用/启用
disable();
enable();
</script>
```

### 监听事件

```vue
<script setup lang="ts">
const { on, off, scale } = useLayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
});

function handleScale(s: number) {
  console.log("当前缩放:", s);
}

on("scaleChange", handleScale);
// off("scaleChange", handleScale);
</script>
```

### 响应式配置

支持传入 `ref` 包裹的配置对象，实现响应式更新：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useLayoutAdaptor } from "@tinyforged/layout-adaptor-vue";

const options = ref({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain" as const,
});

const { scale } = useLayoutAdaptor(options);
</script>
```

### 返回值

| 属性                   | 类型                            | 说明           |
| ---------------------- | ------------------------------- | -------------- |
| `scale`                | `Ref<number>`                   | 当前缩放比例   |
| `started`              | `Ref<boolean>`                  | 是否已启动     |
| `adaptor`              | `Ref<LayoutAdaptor \| null>`    | 适配器实例     |
| `adaptMode`            | `Ref<AdaptMode>`                | 当前适配策略   |
| `direction`            | `Ref<Direction>`                | 当前缩放方向   |
| `activeBreakpoint`     | `Ref<BreakpointConfig \| null>` | 当前激活的断点 |
| `disabled`             | `Ref<boolean>`                  | 是否禁用       |
| `update(options)`      | `Function`                      | 更新配置       |
| `setAdaptMode(mode)`   | `Function`                      | 切换适配策略   |
| `setDirection(dir)`    | `Function`                      | 切换缩放方向   |
| `enable()`             | `Function`                      | 启用           |
| `disable()`            | `Function`                      | 禁用           |
| `on(event, listener)`  | `Function`                      | 监听事件       |
| `off(event, listener)` | `Function`                      | 取消监听       |

## LayoutAdaptorProvider

Provider 组件，通过 Props 声明式配置，子组件通过 `useLayoutAdaptorInject` 共享适配器状态。

### Provider 基本用法

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
  >
    <YourContent />
  </LayoutAdaptorProvider>
</template>
```

也支持通过 `options` prop 传入完整配置对象：

```vue
<script setup>
const adaptorOptions = {
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain",
  resize: true,
};
</script>

<template>
  <LayoutAdaptorProvider :options="adaptorOptions">
    <YourContent />
  </LayoutAdaptorProvider>
</template>
```

### Provider 事件监听

```vue
<script setup>
import { LayoutAdaptorProvider } from "@tinyforged/layout-adaptor-vue";

function onScale(scale) {
  console.log("缩放变化:", scale);
}
</script>

<template>
  <LayoutAdaptorProvider
    design-width="1920"
    design-height="1080"
    target="#app"
    @scale-change="onScale"
    @ready="() => console.log('就绪')"
    @error="(e) => console.error(e)"
  >
    <YourContent />
  </LayoutAdaptorProvider>
</template>
```

### Props

所有 core 包的 `LayoutAdaptorOptions` 均可作为 Props 传入（使用 kebab-case）：

| Prop             | 类型                             | 默认值    | 说明                                 |
| ---------------- | -------------------------------- | --------- | ------------------------------------ |
| `options`        | `LayoutAdaptorOptions`           | `{}`      | 完整配置对象（优先级低于单独 Props） |
| `target`         | `string`                         | `#app`    | 目标元素选择器                       |
| `design-width`   | `number`                         | `1920`    | 设计稿宽度                           |
| `design-height`  | `number`                         | `1080`    | 设计稿高度                           |
| `fit-mode`       | `FitMode`                        | `contain` | 适配方式                             |
| `adapt-mode`     | `AdaptMode`                      | `scale`   | 适配策略                             |
| `align-x`        | `AlignX`                         | `left`    | 水平对齐                             |
| `align-y`        | `AlignY`                         | `top`     | 垂直对齐                             |
| `resize`         | `boolean`                        | `true`    | 监听窗口 resize                      |
| `resize-delay`   | `number`                         | `0`       | resize 防抖(ms)                      |
| `transition`     | `number`                         | `0`       | 过渡动画(ms)                         |
| `overflow`       | `OverflowMode`                   | `hidden`  | 溢出处理                             |
| `min-scale`      | `number`                         | -         | 最小缩放比例                         |
| `max-scale`      | `number`                         | -         | 最大缩放比例                         |
| `direction`      | `Direction`                      | `both`    | 缩放方向                             |
| `keep-dpr`       | `boolean`                        | `false`   | 保持设备像素比                       |
| `root-font-size` | `number`                         | `16`      | rem 基准字号                         |
| `breakpoints`    | `BreakpointConfig[]`             | -         | 响应式断点                           |
| `custom-fit`     | `CustomFitFn`                    | -         | 自定义适配函数                       |
| `debug`          | `boolean \| DebugOverlayOptions` | `false`   | 调试模式                             |
| `disabled`       | `boolean`                        | `false`   | 是否禁用                             |
| `class-name`     | `string`                         | -         | 附加 CSS 类名                        |

### Events

`scale-change` / `resize` / `render` / `start` / `stop` / `ready` / `error` / `adapt-mode-change` / `breakpoint-change` / `direction-change` / `before-render`

## useLayoutAdaptorInject

在 `LayoutAdaptorProvider` 内部的子组件中使用，获取共享的适配器状态。

```vue
<script setup lang="ts">
import { useLayoutAdaptorInject } from "@tinyforged/layout-adaptor-vue";

const { scale, adaptMode, setAdaptMode, disable, on } =
  useLayoutAdaptorInject();

on("breakpointChange", (bp) => {
  console.log("断点切换:", bp);
});
</script>
```

### Inject 返回值

| 属性                   | 类型                            | 说明         |
| ---------------------- | ------------------------------- | ------------ |
| `adaptor`              | `Ref<LayoutAdaptor \| null>`    | 适配器实例   |
| `scale`                | `Ref<number>`                   | 当前缩放比例 |
| `adaptMode`            | `Ref<AdaptMode>`                | 当前适配策略 |
| `direction`            | `Ref<Direction>`                | 当前缩放方向 |
| `activeBreakpoint`     | `Ref<BreakpointConfig \| null>` | 当前断点     |
| `disabled`             | `Ref<boolean>`                  | 是否禁用     |
| `setAdaptMode(mode)`   | `Function`                      | 切换适配策略 |
| `setDirection(dir)`    | `Function`                      | 切换缩放方向 |
| `enable()`             | `Function`                      | 启用         |
| `disable()`            | `Function`                      | 禁用         |
| `on(event, listener)`  | `Function`                      | 监听事件     |
| `off(event, listener)` | `Function`                      | 取消监听     |

## License

MIT
