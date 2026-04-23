# Layout Adaptor

响应式布局适配器，支持多种适配策略，用于将容器元素等比缩放至设计稿尺寸。

<p align="center">
  <a href="https://github.com/tinyforged/layout-adaptor/stargazers"><img src="https://img.shields.io/github/stars/tinyforged/layout-adaptor?style=flat-square" alt="Stars"/></a>
  <a href="https://github.com/tinyforged/layout-adaptor/network/members"><img src="https://img.shields.io/github/forks/tinyforged/layout-adaptor?style=flat-square" alt="Forks"/></a>
  <a href="https://github.com/tinyforged/layout-adaptor/issues"><img src="https://img.shields.io/github/issues/tinyforged/layout-adaptor?style=flat-square" alt="Issues"/></a>
  <a href="https://github.com/tinyforged/layout-adaptor/blob/main/LICENSE"><img src="https://img.shields.io/github/license/tinyforged/layout-adaptor?style=flat-square" alt="License"/></a>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <a href="https://github.com/tinyforged/layout-adaptor/commits/main"><img src="https://img.shields.io/github/last-commit/tinyforged/layout-adaptor?style=flat-square" alt="Last commit"/></a>
</p>

<p align="center">
  <strong><a href="https://layout-adaptor.vercel.app/">在线演示 →</a></strong>
</p>

## Packages

| Package                                          | Version                                                                                            | Downloads                                                                                          | Description        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| [@tinyforged/layout-adaptor](./packages/core)    | ![npm](https://img.shields.io/npm/v/@tinyforged/layout-adaptor?style=flat-square)                  | ![dl](https://img.shields.io/npm/dt/@tinyforged/layout-adaptor?style=flat-square)                  | 框架无关的核心实现 |
| [@tinyforged/layout-adaptor-vue](./packages/vue) | ![npm](https://img.shields.io/npm/v/@tinyforged/layout-adaptor-vue?style=flat-square&color=42b883) | ![dl](https://img.shields.io/npm/dt/@tinyforged/layout-adaptor-vue?style=flat-square&color=42b883) | Vue 3 绑定         |

## Features

- **多种适配策略**: scale / rem / vwvh / zoom
- **6 种适配方式**: contain / cover / fill / width / height / crop
- **响应式断点**: 根据视口大小动态切换配置
- **忽略规则**: 指定元素不受缩放影响
- **反缩放**: 对子元素应用反向缩放矫正
- **缩放限制**: 支持 minScale / maxScale
- **缩放方向**: horizontal / vertical / both
- **平滑过渡**: 支持 CSS transition 动画
- **Debug 模式**: 可视化调试叠加层
- **事件系统**: on / off / once 监听适配状态
- **Vue 3 集成**: composable hook 和 Provider 组件

## Installation

```bash
# 核心包（框架无关）
pnpm add @tinyforged/layout-adaptor

# Vue 3 绑定（内置 core 包，无需单独安装）
pnpm add @tinyforged/layout-adaptor-vue
```

## Quick Start

### Core

```typescript
import { LayoutAdaptor } from "@tinyforged/layout-adaptor";

const adaptor = new LayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain",
  resize: true,
});

adaptor.start();
```

也支持直接传入 DOM 元素：

```typescript
const adaptor = new LayoutAdaptor({
  target: document.getElementById("app"),
  designWidth: 1920,
  designHeight: 1080,
});
```

### Vue 3 — Composable

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

const { scale, started, update, disable, enable } = useLayoutAdaptor({
  target: containerRef,
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain",
  resize: true,
});
</script>
```

### Vue 3 — Provider 组件

```vue
<script setup>
import { LayoutAdaptorProvider } from "@tinyforged/layout-adaptor-vue";
import { useLayoutAdaptorInject } from "@tinyforged/layout-adaptor-vue";
</script>

<template>
  <LayoutAdaptorProvider
    design-width="1920"
    design-height="1080"
    target="#app"
    fit-mode="contain"
    @scale-change="onScale"
  >
    <ChildComponent />
  </LayoutAdaptorProvider>
</template>
```

子组件通过 `useLayoutAdaptorInject` 获取共享状态：

```vue
<script setup>
import { useLayoutAdaptorInject } from "@tinyforged/layout-adaptor-vue";

const { scale, setAdaptMode, disable } = useLayoutAdaptorInject();
</script>
```

## API

### Options

| 选项            | 类型                             | 默认值     | 说明                              |
| --------------- | -------------------------------- | ---------- | --------------------------------- |
| `target`        | `string \| HTMLElement`          | `#app`     | 目标元素（CSS 选择器或 DOM 元素） |
| `designWidth`   | `number`                         | `1920`     | 设计稿宽度                        |
| `designHeight`  | `number`                         | `1080`     | 设计稿高度                        |
| `fitMode`       | `FitMode`                        | `contain`  | 适配方式                          |
| `adaptMode`     | `AdaptMode`                      | `scale`    | 适配策略                          |
| `alignX`        | `AlignX`                         | `left`     | 水平对齐                          |
| `alignY`        | `AlignY`                         | `top`      | 垂直对齐                          |
| `resize`        | `boolean`                        | `true`     | 监听窗口 resize                   |
| `resizeDelay`   | `number`                         | `0`        | resize 防抖延迟(ms)               |
| `transition`    | `number`                         | `0`        | 过渡动画时长(ms)                  |
| `overflow`      | `OverflowMode`                   | `hidden`   | 溢出处理                          |
| `minScale`      | `number`                         | `0`        | 最小缩放比例                      |
| `maxScale`      | `number`                         | `Infinity` | 最大缩放比例                      |
| `direction`     | `Direction`                      | `both`     | 缩放方向                          |
| `keepDPR`       | `boolean`                        | `false`    | 保持设备像素比                    |
| `rootFontSize`  | `number`                         | `16`       | rem 模式基准字号                  |
| `ignore`        | `IgnoreRule[]`                   | `[]`       | 忽略缩放的元素规则                |
| `customFit`     | `CustomFitFn`                    | -          | 自定义适配函数                    |
| `breakpoints`   | `BreakpointConfig[]`             | `[]`       | 响应式断点                        |
| `debug`         | `boolean \| DebugOverlayOptions` | `false`    | 调试模式                          |
| `disabled`      | `boolean`                        | `false`    | 初始禁用                          |
| `className`     | `string`                         | -          | 目标元素的附加 CSS 类名           |
| `onScaleChange` | `(scale: number) => void`        | -          | 缩放变化回调                      |

### FitMode（适配方式）

| 模式      | 说明                             |
| --------- | -------------------------------- |
| `contain` | 等比缩放，完整显示内容           |
| `cover`   | 等比缩放，填满容器，超出部分裁剪 |
| `fill`    | 按最大比例缩放填满容器           |
| `width`   | 按宽度缩放                       |
| `height`  | 按高度缩放                       |
| `crop`    | 按最大比例缩放并裁剪             |

### AdaptMode（适配策略）

| 模式    | 说明                                     |
| ------- | ---------------------------------------- |
| `scale` | 通过 CSS `transform: scale()` 缩放       |
| `rem`   | 通过修改根元素 `font-size` 实现 rem 缩放 |
| `vwvh`  | 通过 `vw` / `vh` 单位实现视口缩放        |
| `zoom`  | 通过 CSS `zoom` 属性缩放                 |

### Methods

| 方法                             | 说明                   |
| -------------------------------- | ---------------------- |
| `start()`                        | 启动适配               |
| `stop()`                         | 停止适配               |
| `enable()`                       | 启用（从禁用状态恢复） |
| `disable()`                      | 禁用适配               |
| `update(options)`                | 更新配置               |
| `setAdaptMode(mode)`             | 切换适配策略           |
| `setDirection(dir)`              | 切换缩放方向           |
| `on(event, listener)`            | 监听事件               |
| `off(event, listener)`           | 取消监听               |
| `once(event, listener)`          | 监听一次               |
| `inverseScale(selector, level?)` | 对子元素应用反向缩放   |
| `resetInverse(selector)`         | 移除反向缩放           |
| `destroy()`                      | 停止并释放所有事件监听 |

| 事件               | 回调签名                            | 说明         |
| ------------------ | ----------------------------------- | ------------ |
| `scaleChange`      | `(scale: number)`                   | 缩放比例变化 |
| `resize`           | `(entry: { viewportW, viewportH })` | 视口尺寸变化 |
| `start`            | `()`                                | 适配器启动   |
| `stop`             | `()`                                | 适配器停止   |
| `ready`            | `()`                                | 首次渲染完成 |
| `error`            | `(error: Error)`                    | 发生错误     |
| `render`           | `(state: LayoutAdaptorState)`       | 每次渲染完成 |
| `beforeRender`     | `(state: LayoutAdaptorState)`       | 渲染前       |
| `adaptModeChange`  | `(mode: AdaptMode)`                 | 适配策略切换 |
| `breakpointChange` | `(bp: BreakpointConfig \| null)`    | 断点切换     |
| `directionChange`  | `(dir: Direction)`                  | 缩放方向切换 |

## Development

```bash
pnpm install       # 安装依赖
pnpm dev           # 启动开发服务器
pnpm build         # 构建所有包
pnpm typecheck     # 类型检查
pnpm lint          # 代码检查
```

## License

MIT © [tinyforged](https://github.com/tinyforged)
