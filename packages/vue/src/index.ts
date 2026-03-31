export { useLayoutAdaptor } from "./composables/useLayoutAdaptor";
export type { UseLayoutAdaptorReturn } from "./composables/useLayoutAdaptor";
export { useLayoutAdaptorInject } from "./composables/useLayoutAdaptorInject";
export type { UseLayoutAdaptorInjectReturn } from "./composables/useLayoutAdaptorInject";
export { LayoutAdaptorProvider, LAYOUT_ADAPTOR_KEY } from "./components/LayoutAdaptorProvider";
export type { LayoutAdaptorInjectValue } from "./components/LayoutAdaptorProvider";
export {
  LayoutAdaptor,
  createStrategy,
  ScaleStrategy,
  RemStrategy,
  VwvhStrategy,
  ZoomStrategy,
  DebugOverlay,
  type LayoutAdaptorOptions,
  type IgnoreRule,
  type LayoutAdaptorState,
  type InverseTarget,
  type FitMode,
  type AlignX,
  type AlignY,
  type ScaleInfo,
  type CustomFitFn,
  type OverflowMode,
  type AdaptMode,
  type Direction,
  type BreakpointConfig,
  type DebugOverlayOptions,
  type LayoutAdaptorEventMap,
  type LayoutAdaptorEventType,
  type LayoutAdaptorEventListener,
  type AdaptStrategy,
} from "layout-adaptor";
