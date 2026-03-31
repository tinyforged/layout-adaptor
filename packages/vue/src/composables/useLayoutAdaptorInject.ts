import { inject, type Ref } from "vue";
import {
  type LayoutAdaptor,
  type LayoutAdaptorEventType,
  type LayoutAdaptorEventListener,
  type AdaptMode,
  type Direction,
  type BreakpointConfig,
} from "layout-adaptor";
import {
  LAYOUT_ADAPTOR_KEY,
  type LayoutAdaptorInjectValue,
} from "../components/LayoutAdaptorProvider";

export interface UseLayoutAdaptorInjectReturn {
  adaptor: Ref<LayoutAdaptor | null>;
  scale: Ref<number>;
  adaptMode: Ref<AdaptMode>;
  direction: Ref<Direction>;
  activeBreakpoint: Ref<BreakpointConfig | null>;
  disabled: Ref<boolean>;
  setAdaptMode: (mode: AdaptMode) => void;
  setDirection: (dir: Direction) => void;
  enable: () => void;
  disable: () => void;
  on: <T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ) => void;
  off: <T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ) => void;
}

export function useLayoutAdaptorInject(): UseLayoutAdaptorInjectReturn {
  const ctx = inject<LayoutAdaptorInjectValue>(LAYOUT_ADAPTOR_KEY);

  if (!ctx) {
    throw new Error(
      "[@layout-adaptor/vue] useLayoutAdaptorInject must be used inside a LayoutAdaptorProvider",
    );
  }

  return {
    adaptor: ctx.adaptor,
    scale: ctx.scale,
    adaptMode: ctx.adaptMode,
    direction: ctx.direction,
    activeBreakpoint: ctx.activeBreakpoint,
    disabled: ctx.disabled,
    setAdaptMode: ctx.setAdaptMode,
    setDirection: ctx.setDirection,
    enable: ctx.enable,
    disable: ctx.disable,
    on: ctx.on,
    off: ctx.off,
  };
}
