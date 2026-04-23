# @tinyforged/layout-adaptor

响应式布局适配器核心包，将容器元素等比缩放至设计稿尺寸。框架无关，支持多种适配策略。

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

支持直接传入 DOM 元素：

```typescript
const adaptor = new LayoutAdaptor({
  target: document.getElementById("app"),
  designWidth: 1920,
  designHeight: 1080,
});
```

## 适配方式（FitMode）

通过 `fitMode` 选项控制内容在容器中的填充方式：

| 模式      | 说明                             |
| --------- | -------------------------------- |
| `contain` | 等比缩放，完整显示（默认）       |
| `cover`   | 等比缩放，填满容器，超出部分裁剪 |
| `fill`    | 按最大比例缩放填满容器           |
| `width`   | 按宽度缩放                       |
| `height`  | 按高度缩放                       |
| `crop`    | 按最大比例缩放并裁剪             |

## 适配策略（AdaptMode）

通过 `adaptMode` 选项选择不同的缩放实现方式：

| 模式    | 说明                                  |
| ------- | ------------------------------------- |
| `scale` | CSS `transform: scale()`（默认）      |
| `rem`   | 修改根元素 `font-size`，通过 rem 缩放 |
| `vwvh`  | 通过 `vw` / `vh` 视口单位缩放         |
| `zoom`  | CSS `zoom` 属性缩放                   |

## 忽略规则

指定特定子元素不受缩放影响，或使用自定义缩放：

```typescript
const adaptor = new LayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  ignore: [
    { selector: ".no-scale" },
    { selector: ".fixed-size", fontSize: 14, width: "200px", height: "100px" },
    { selector: ".half-scale", scale: 0.5 },
  ],
});
```

## 反向缩放

对已缩放的子元素应用反向矫正，使其恢复正常尺寸：

```typescript
// 对 .chart 元素应用 1 级反向缩放
adaptor.inverseScale(".chart");

// 对 .tooltip 元素应用 2 级反向缩放
adaptor.inverseScale(".tooltip", 2);

// 移除反向缩放
adaptor.resetInverse(".chart");
```

## 响应式断点

根据视口尺寸自动切换配置：

```typescript
const adaptor = new LayoutAdaptor({
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  breakpoints: [
    {
      maxWidth: 1366,
      designWidth: 1366,
      designHeight: 768,
    },
    {
      maxWidth: 768,
      designWidth: 375,
      designHeight: 667,
      fitMode: "fill",
    },
  ],
});
```

## 调试模式

开启可视化调试叠加层，显示缩放信息：

```typescript
// 简单开启
const adaptor = new LayoutAdaptor({ target: "#app", debug: true });

// 自定义调试面板
const adaptor = new LayoutAdaptor({
  target: "#app",
  debug: {
    color: "rgba(255, 0, 0, 0.8)",
    position: "top-right",
    showGrid: true,
  },
});
```

## Options

| 选项            | 类型                             | 默认值     | 说明                |
| --------------- | -------------------------------- | ---------- | ------------------- |
| `target`        | `string \| HTMLElement`          | `#app`     | 目标元素            |
| `designWidth`   | `number`                         | `1920`     | 设计稿宽度          |
| `designHeight`  | `number`                         | `1080`     | 设计稿高度          |
| `fitMode`       | `FitMode`                        | `contain`  | 适配方式            |
| `adaptMode`     | `AdaptMode`                      | `scale`    | 适配策略            |
| `alignX`        | `AlignX`                         | `left`     | 水平对齐            |
| `alignY`        | `AlignY`                         | `top`      | 垂直对齐            |
| `resize`        | `boolean`                        | `true`     | 监听窗口 resize     |
| `resizeDelay`   | `number`                         | `0`        | resize 防抖延迟(ms) |
| `transition`    | `number`                         | `0`        | 过渡动画时长(ms)    |
| `overflow`      | `OverflowMode`                   | `hidden`   | 溢出处理            |
| `minScale`      | `number`                         | `0`        | 最小缩放比例        |
| `maxScale`      | `number`                         | `Infinity` | 最大缩放比例        |
| `direction`     | `Direction`                      | `both`     | 缩放方向            |
| `keepDPR`       | `boolean`                        | `false`    | 保持设备像素比      |
| `rootFontSize`  | `number`                         | `16`       | rem 模式基准字号    |
| `ignore`        | `IgnoreRule[]`                   | `[]`       | 忽略缩放的元素规则  |
| `customFit`     | `CustomFitFn`                    | -          | 自定义适配函数      |
| `breakpoints`   | `BreakpointConfig[]`             | `[]`       | 响应式断点          |
| `debug`         | `boolean \| DebugOverlayOptions` | `false`    | 调试模式            |
| `disabled`      | `boolean`                        | `false`    | 初始禁用            |
| `className`     | `string`                         | -          | 附加 CSS 类名       |
| `onScaleChange` | `(scale: number) => void`        | -          | 缩放变化回调        |

## Methods

| 方法                             | 返回值 | 说明               |
| -------------------------------- | ------ | ------------------ |
| `start()`                        | `this` | 启动适配           |
| `stop()`                         | `this` | 停止适配           |
| `enable()`                       | `this` | 启用（从禁用恢复） |
| `disable()`                      | `this` | 禁用适配           |
| `update(options)`                | `this` | 更新配置           |
| `setAdaptMode(mode)`             | `this` | 切换适配策略       |
| `setDirection(dir)`              | `this` | 切换缩放方向       |
| `on(event, listener)`            | `this` | 监听事件           |
| `off(event, listener)`           | `this` | 取消监听           |
| `once(event, listener)`          | `this` | 监听一次           |
| `inverseScale(selector, level?)` | `this` | 反向缩放子元素     |
| `resetInverse(selector)`         | `this` | 移除反向缩放       |
| `destroy()`                      | `this` | 停止并释放所有监听 |

## Events

| 事件               | 回调签名                         | 说明         |
| ------------------ | -------------------------------- | ------------ |
| `scaleChange`      | `(scale: number)`                | 缩放比例变化 |
| `resize`           | `({ viewportW, viewportH })`     | 视口尺寸变化 |
| `start`            | `()`                             | 适配器启动   |
| `stop`             | `()`                             | 适配器停止   |
| `ready`            | `()`                             | 首次渲染完成 |
| `error`            | `(error: Error)`                 | 发生错误     |
| `render`           | `(state: LayoutAdaptorState)`    | 每次渲染完成 |
| `beforeRender`     | `(state: LayoutAdaptorState)`    | 渲染前       |
| `adaptModeChange`  | `(mode: AdaptMode)`              | 适配策略切换 |
| `breakpointChange` | `(bp: BreakpointConfig \| null)` | 断点切换     |
| `directionChange`  | `(dir: Direction)`               | 缩放方向切换 |

## License

MIT
