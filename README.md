# Layout Adaptor

响应式布局适配器，支持多种适配策略，用于将容器元素缩放到设计尺寸。

**[在线演示 →](https://layout-adaptor.vercel.app/)**

## Packages

| Package                                            | Version                                                                                                                               | Description        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [`@tinyforged/layout-adaptor`](./packages/core)    | ![npm](https://img.shields.io/npm/v/@tinyforged/layout-adaptor?style=flat-square)                                                     | 框架无关的核心实现 |
| [`@tinyforged/layout-adaptor-vue`](./packages/vue) | ![npm](https://img.shields.io/npm/v/@tinyforged/layout-adaptor-vue?style=flat-square&color=42b883) | Vue 3 绑定         |

## Features

- **多种适配策略**: scale / rem / vwvh / zoom
- **6 种适配模式**: contain / cover / fill / width / height / crop
- **响应式断点**: 根据断点动态切换配置
- **Debug 模式**: 可视化调试面板
- **缩放方向**: horizontal / vertical / both
- **缩放限制**: 支持 minScale / maxScale
- **平滑过渡**: 支持 CSS transition 动画
- **事件系统**: on / off / once 监听事件
- **Vue 3 集成**: composable 和 Provider 组件

## Installation

```bash
# 核心包
pnpm add @tinyforged/layout-adaptor

# Vue 3 绑定
pnpm add @tinyforged/layout-adaptor-vue
```

## Usage

### Core

```typescript
import { Adaptor } from "@tinyforged/layout-adaptor";

const adaptor = new Adaptor({
  element: "#app",
  designWidth: 1920,
  designHeight: 1080,
  mode: "contain",
  enableResize: true,
});

adaptor.activate();
```

### Vue 3

```vue
<script setup>
import { useLayoutAdaptor } from "@tinyforged/layout-adaptor-vue";

const { scale, rectify } = useLayoutAdaptor({
  designWidth: 1920,
  designHeight: 1080,
});
</script>
```

## API

### Adaptor Options

| Option         | Type                                         | Default     | Description         |
| -------------- | -------------------------------------------- | ----------- | ------------------- |
| `element`      | `string \| HTMLElement`                      | -           | 目标元素            |
| `designWidth`  | `number`                                     | `1920`      | 设计稿宽度          |
| `designHeight` | `number`                                     | `1080`      | 设计稿高度          |
| `mode`         | `'contain' \| 'cover' \| 'fill' \| 'custom'` | `'contain'` | 适配模式            |
| `enableResize` | `boolean`                                    | `true`      | 是否监听窗口 resize |
| `breakpoints`  | `Breakpoint[]`                               | -           | 响应式断点配置      |
| `direction`    | `'ltr' \| 'rtl'`                             | `'ltr'`     | 布局方向            |
| `scaleLimits`  | `{ min?: number, max?: number }`             | -           | 缩放限制            |
| `debug`        | `boolean`                                    | `false`     | 是否开启调试模式    |

### Adaptor Methods

- `activate()`: 激活适配器
- `deactivate()`: 停用适配器
- `applyRectification(level)`: 应用矫正
- `updateOptions(options)`: 更新配置

## Development

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm typecheck
```

## License

MIT © [tinyforged](https://github.com/tinyforged)
