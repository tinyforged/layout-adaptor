# @tinyforged/layout-adaptor

响应式布局适配器，将容器元素等比缩放至设计稿尺寸。框架无关，支持多种适配策略。

## 安装

```bash
pnpm add @tinyforged/layout-adaptor
```

## 快速开始

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

## 适配模式

通过 `adaptMode` 选项选择缩放策略：

| 模式 | 说明 |
| --- | --- |
| `scale` | 通过 CSS `transform: scale()` 缩放（默认） |
| `rem` | 通过修改根元素 `font-size` 实现 rem 缩放 |
| `vwvh` | 通过 `vw` / `vh` 单位实现视口缩放 |
| `zoom` | 通过 CSS `zoom` 属性缩放 |

## 适配方式

通过 `fitMode` 选项控制内容填充方式：

| 模式 | 说明 |
| --- | --- |
| `contain` | 等比缩放，完整显示（默认） |
| `cover` | 等比缩放，填满容器，超出部分裁剪 |
| `fill` | 拉伸填满，可能变形 |
| `width` | 按宽度缩放 |
| `height` | 按高度缩放 |
| `crop` | 按最大比例缩放并裁剪 |

## API

### Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `target` | `string` | `#app` | 目标元素选择器 |
| `designWidth` | `number` | `1920` | 设计稿宽度 |
| `designHeight` | `number` | `1080` | 设计稿高度 |
| `fitMode` | `FitMode` | `contain` | 适配方式 |
| `adaptMode` | `AdaptMode` | `scale` | 适配模式 |
| `alignX` | `AlignX` | `left` | 水平对齐 |
| `alignY` | `AlignY` | `top` | 垂直对齐 |
| `resize` | `boolean` | `true` | 监听窗口 resize |
| `resizeDelay` | `number` | `0` | resize 防抖延迟(ms) |
| `transition` | `number` | `0` | 过渡动画时长(ms) |
| `overflow` | `OverflowMode` | `hidden` | 溢出处理 |
| `minScale` | `number` | `0` | 最小缩放比例 |
| `maxScale` | `number` | `Infinity` | 最大缩放比例 |
| `direction` | `Direction` | `both` | 缩放方向 |
| `keepDPR` | `boolean` | `false` | 保持设备像素比 |
| `rootFontSize` | `number` | `16` | rem 模式基准字号 |
| `breakpoints` | `BreakpointConfig[]` | `[]` | 响应式断点 |
| `ignore` | `IgnoreRule[]` | `[]` | 忽略缩放的元素规则 |
| `debug` | `boolean \| DebugOverlayOptions` | `false` | 调试模式 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `customFit` | `CustomFitFn` | - | 自定义适配函数 |

### Methods

- `start()` — 启动适配
- `stop()` — 停止适配
- `update(options)` — 更新配置
- `setFitMode(mode)` — 切换适配方式
- `setAdaptMode(mode)` — 切换适配模式
- `setDirection(dir)` — 切换缩放方向
- `enable()` — 启用
- `disable()` — 禁用
- `on(event, listener)` — 监听事件
- `off(event, listener)` — 取消监听
- `once(event, listener)` — 监听一次

### Events

`scaleChange` / `resize` / `start` / `stop` / `ready` / `error` / `render` / `adaptModeChange` / `breakpointChange` / `directionChange` / `beforeRender`

## License

MIT
