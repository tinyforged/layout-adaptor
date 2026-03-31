export interface DemoMeta {
  id: string;
  title: string;
  description: string;
  source: string;
}

export const coreDemos: DemoMeta[] = [
  {
    id: "core-basic",
    title: "Basic Scale",
    description:
      "最基础的用法：指定设计稿尺寸和容器选择器，自动等比缩放以适配视口。",
    source: `import { LayoutAdaptor } from 'layout-adaptor'

const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  resize: true,
  onScaleChange: (scale) => {
    console.log('scale changed:', scale)
  },
})
adaptor.start()`,
  },
  {
    id: "core-fitmode",
    title: "FitMode 适配模式",
    description:
      "支持 6 种适配模式：contain、cover、fill、width、height、crop。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  fitMode: 'contain',
  alignX: 'center',
  alignY: 'center',
})
adaptor.start()`,
  },
  {
    id: "core-ignore",
    title: "Ignore",
    description:
      "通过 ignore 选项指定某些元素不跟随缩放，保持原始大小。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  ignore: [
    { selector: '.no-scale', fontSize: 14 },
    { selector: '.fixed-size', scale: 1, width: '200px', height: '100px' },
  ],
})
adaptor.start()`,
  },
  {
    id: "core-rectify",
    title: "Rectify",
    description:
      "对指定元素进行反向修正，使其在缩放后的视觉尺寸保持原始大小。",
    source: `const adaptor = new LayoutAdaptor({ ... })
adaptor.start()
adaptor.inverseScale('.rectify-target', 1)`,
  },
  {
    id: "core-transition",
    title: "Transition",
    description: "transition 控制缩放过渡动画秒数，resizeDelay 控制防抖延迟。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  transition: 0.3,
  resizeDelay: 200,
})
adaptor.start()`,
  },
  {
    id: "core-customfit",
    title: "CustomFit",
    description: "通过 customFit 函数完全自定义缩放计算逻辑。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  customFit: (info) => {
    return (info.ratioX + info.ratioY) / 2
  },
})
adaptor.start()`,
  },
  {
    id: "core-scale-limits",
    title: "Scale Limits",
    description: "通过 minScale 和 maxScale 限制缩放范围。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  minScale: 0.5,
  maxScale: 2.0,
})
adaptor.start()`,
  },
  {
    id: "core-events",
    title: "Event System",
    description: "内置事件系统：on/off/once 监听各种事件。",
    source: `const adaptor = new LayoutAdaptor({ ... })
adaptor.on('scaleChange', (scale) => console.log(scale))
adaptor.on('resize', (e) => console.log(e))
adaptor.start()`,
  },
  {
    id: "core-overflow",
    title: "Overflow",
    description: "overflow 配置项控制目标容器溢出行为。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  fitMode: 'crop',
  overflow: 'hidden',
})
adaptor.start()`,
  },
  {
    id: "core-adaptmode",
    title: "AdaptMode",
    description: "支持 4 种适配策略：scale、rem、vwvh、zoom。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  adaptMode: 'scale',
})
adaptor.start()
adaptor.setAdaptMode('rem')`,
  },
  {
    id: "core-direction",
    title: "Direction",
    description: "direction 控制缩放方向：horizontal、vertical、both。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  direction: 'horizontal',
})
adaptor.start()
adaptor.setDirection('both')`,
  },
  {
    id: "core-breakpoints",
    title: "Breakpoints",
    description: "通过 breakpoints 配置响应式断点。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  breakpoints: [
    { minWidth: 0, maxWidth: 768, designWidth: 1366, designHeight: 768 },
    { minWidth: 1200, designWidth: 1920, designHeight: 1080 },
  ],
})
adaptor.start()`,
  },
  {
    id: "core-debug",
    title: "Debug",
    description: "开启调试面板显示实时状态信息。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
  debug: true,
})
adaptor.start()`,
  },
  {
    id: "core-disabled",
    title: "Disabled",
    description: "动态启用/禁用适配器。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  disabled: true,
})
adaptor.start()
adaptor.enable()
adaptor.disable()`,
  },
]

export const vueDemos: DemoMeta[] = [
  {
    id: "vue-composable",
    title: "useLayoutAdaptor",
    description: "Vue 3 Composable Hook，自动管理生命周期。",
    source: `import { useLayoutAdaptor } from '@layout-adaptor/vue'

const { scale, adaptor, update } = useLayoutAdaptor({
  target: '#app',
  designWidth: 1920,
  designHeight: 1080,
})`,
  },
  {
    id: "vue-provider",
    title: "LayoutAdaptorProvider",
    description: "Vue 3 组件方式，用 Provider 包裹内容区域。",
    source: `<LayoutAdaptorProvider
  :design-width="1920"
  :design-height="1080"
  target="#app"
>
  <YourContent />
</LayoutAdaptorProvider>`,
  },
  {
    id: "vue-sync",
    title: "update 动态更新",
    description: "运行时动态切换配置。",
    source: `const { update } = useLayoutAdaptor({ ... })
update({ designWidth: 1280, designHeight: 720 })`,
  },
  {
    id: "vue-adaptmode",
    title: "AdaptMode",
    description: "运行时切换适配模式。",
    source: `const { adaptMode, setAdaptMode } = useLayoutAdaptor({ ... })
setAdaptMode('rem')`,
  },
  {
    id: "vue-breakpoints",
    title: "Breakpoints",
    description: "配置响应式断点。",
    source: `const { activeBreakpoint } = useLayoutAdaptor({
  breakpoints: [
    { minWidth: 0, maxWidth: 768, designWidth: 1366 },
  ],
})`,
  },
  {
    id: "vue-direction",
    title: "Direction",
    description: "运行时切换缩放方向。",
    source: `const { direction, setDirection } = useLayoutAdaptor({ ... })
setDirection('horizontal')`,
  },
  {
    id: "vue-debug",
    title: "Debug",
    description: "开启调试面板。",
    source: `const adaptor = new LayoutAdaptor({
  target: '#app',
  debug: true,
})`,
  },
]
