export type FitMode =
  | "contain"
  | "cover"
  | "fill"
  | "width"
  | "height"
  | "crop";

export type AlignX = "left" | "center" | "right";
export type AlignY = "top" | "center" | "bottom";

export type AdaptMode = "scale" | "rem" | "vwvh" | "zoom";

export type Direction = "horizontal" | "vertical" | "both";

export interface IgnoreRule {
  selector: string;
  scale?: number;
  fontSize?: number;
  width?: string;
  height?: string;
}

export interface ScaleInfo {
  ratioX: number;
  ratioY: number;
  viewportW: number;
  viewportH: number;
  designW: number;
  designH: number;
  fitMode: FitMode;
}

export type CustomFitFn = (info: ScaleInfo) => number;

export type OverflowMode = "hidden" | "visible" | "auto";

export interface BreakpointConfig {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  designWidth?: number;
  designHeight?: number;
  fitMode?: FitMode;
}

export interface DebugOverlayOptions {
  enabled?: boolean;
  color?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showGrid?: boolean;
}

export interface LayoutAdaptorOptions {
  target?: string | HTMLElement;
  designWidth?: number;
  designHeight?: number;
  fitMode?: FitMode;
  alignX?: AlignX;
  alignY?: AlignY;
  resize?: boolean;
  resizeDelay?: number;
  transition?: number;
  ignore?: IgnoreRule[];
  onScaleChange?: (scale: number) => void;
  customFit?: CustomFitFn;
  minScale?: number;
  maxScale?: number;
  overflow?: OverflowMode;
  adaptMode?: AdaptMode;
  direction?: Direction;
  keepDPR?: boolean;
  rootFontSize?: number;
  breakpoints?: BreakpointConfig[];
  debug?: boolean | DebugOverlayOptions;
  disabled?: boolean;
  className?: string;
}

export type LayoutAdaptorEventMap = {
  scaleChange: (scale: number) => void;
  resize: (entry: { viewportW: number; viewportH: number }) => void;
  start: () => void;
  stop: () => void;
  error: (error: Error) => void;
  render: (state: LayoutAdaptorState) => void;
  adaptModeChange: (mode: AdaptMode) => void;
  breakpointChange: (bp: BreakpointConfig | null) => void;
  directionChange: (dir: Direction) => void;
  beforeRender: (state: LayoutAdaptorState) => void;
  ready: () => void;
};

export type LayoutAdaptorEventType = keyof LayoutAdaptorEventMap;

export type LayoutAdaptorEventListener<T extends LayoutAdaptorEventType> =
  LayoutAdaptorEventMap[T];

export interface LayoutAdaptorState {
  scale: number;
  started: boolean;
  designWidth: number;
  designHeight: number;
  fitMode: FitMode;
  viewportWidth: number;
  viewportHeight: number;
  translateX: number;
  translateY: number;
  adaptMode: AdaptMode;
  direction: Direction;
  dpr: number;
  activeBreakpoint: BreakpointConfig | null;
  rootFontSize: number;
}

export interface InverseTarget {
  selector: string;
  level: number;
}

export interface AdaptStrategy {
  apply(
    el: HTMLElement,
    info: {
      scale: number;
      translateX: number;
      translateY: number;
      designW: number;
      designH: number;
      viewportW: number;
      viewportH: number;
      direction: Direction;
      overflow: OverflowMode;
      transition: number;
      dpr: number;
      rootFontSize: number;
    },
  ): void;
  cleanup(el: HTMLElement): void;
  inverseScale?(
    el: HTMLElement,
    scale: number,
    origW: number,
    origH: number,
    level: number,
    dpr: number,
    rootFontSize: number,
  ): void;
}
