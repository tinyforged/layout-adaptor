import {
  defineComponent,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type PropType,
  type Ref,
} from "vue";
import {
  LayoutAdaptor,
  type LayoutAdaptorOptions,
  type FitMode,
  type AlignX,
  type AlignY,
  type OverflowMode,
  type CustomFitFn,
  type AdaptMode,
  type Direction,
  type BreakpointConfig,
  type DebugOverlayOptions,
  type LayoutAdaptorEventType,
  type LayoutAdaptorEventListener,
} from "@tinyforged/layout-adaptor";

export const LAYOUT_ADAPTOR_KEY = Symbol("layout-adaptor");

export interface LayoutAdaptorInjectValue {
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

export const LayoutAdaptorProvider = defineComponent({
  name: "LayoutAdaptorProvider",
  props: {
    options: {
      type: Object as PropType<LayoutAdaptorOptions>,
      default: () => ({}),
    },
    designWidth: {
      type: Number,
      default: 1920,
    },
    designHeight: {
      type: Number,
      default: 1080,
    },
    target: {
      type: String,
      default: "#app",
    },
    fitMode: {
      type: String as PropType<FitMode>,
      default: "contain",
    },
    alignX: {
      type: String as PropType<AlignX>,
      default: "left",
    },
    alignY: {
      type: String as PropType<AlignY>,
      default: "top",
    },
    resize: {
      type: Boolean,
      default: true,
    },
    transition: {
      type: Number,
      default: 0,
    },
    resizeDelay: {
      type: Number,
      default: 0,
    },
    overflow: {
      type: String as PropType<OverflowMode>,
      default: "hidden",
    },
    minScale: {
      type: Number,
      default: undefined,
    },
    maxScale: {
      type: Number,
      default: undefined,
    },
    customFit: {
      type: Function as PropType<CustomFitFn>,
      default: undefined,
    },
    adaptMode: {
      type: String as PropType<AdaptMode>,
      default: "scale",
    },
    direction: {
      type: String as PropType<Direction>,
      default: "both",
    },
    keepDPR: {
      type: Boolean,
      default: false,
    },
    rootFontSize: {
      type: Number,
      default: 16,
    },
    breakpoints: {
      type: Array as PropType<BreakpointConfig[]>,
      default: undefined,
    },
    debug: {
      type: [Boolean, Object] as PropType<boolean | DebugOverlayOptions>,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: "",
    },
  },
  emits: {
    scaleChange: (_scale: number) => true,
    resize: (_entry: { viewportW: number; viewportH: number }) => true,
    render: (_state: any) => true,
    start: () => true,
    stop: () => true,
    ready: () => true,
    error: (_error: Error) => true,
    adaptModeChange: (_mode: AdaptMode) => true,
    breakpointChange: (_bp: BreakpointConfig | null) => true,
    directionChange: (_dir: Direction) => true,
    beforeRender: (_state: any) => true,
  },
  setup(props, { slots, emit }) {
    const adaptor = ref<LayoutAdaptor | null>(null);
    const scale = ref(1);
    const currentAdaptMode = ref<AdaptMode>(props.adaptMode);
    const currentDirection = ref<Direction>(props.direction);
    const activeBreakpoint = ref<BreakpointConfig | null>(null);
    const isDisabled = ref(props.disabled);

    const on = <T extends LayoutAdaptorEventType>(
      event: T,
      listener: LayoutAdaptorEventListener<T>,
    ) => {
      adaptor.value?.on(event, listener);
    };

    const off = <T extends LayoutAdaptorEventType>(
      event: T,
      listener: LayoutAdaptorEventListener<T>,
    ) => {
      adaptor.value?.off(event, listener);
    };

    const setAdaptMode = (mode: AdaptMode) => {
      adaptor.value?.setAdaptMode(mode);
      currentAdaptMode.value = mode;
    };

    const setDirection = (dir: Direction) => {
      adaptor.value?.setDirection(dir);
      currentDirection.value = dir;
    };

    const enable = () => {
      adaptor.value?.enable();
      isDisabled.value = false;
    };

    const disable = () => {
      adaptor.value?.disable();
      isDisabled.value = true;
    };

    const buildOptions = (): LayoutAdaptorOptions => ({
      ...props.options,
      designWidth: props.designWidth,
      designHeight: props.designHeight,
      target: props.target,
      fitMode: props.fitMode,
      alignX: props.alignX,
      alignY: props.alignY,
      resize: props.resize,
      transition: props.transition,
      resizeDelay: props.resizeDelay,
      overflow: props.overflow,
      ...(props.minScale !== undefined ? { minScale: props.minScale } : {}),
      ...(props.maxScale !== undefined ? { maxScale: props.maxScale } : {}),
      ...(props.customFit ? { customFit: props.customFit } : {}),
      adaptMode: props.adaptMode,
      direction: props.direction,
      keepDPR: props.keepDPR,
      rootFontSize: props.rootFontSize,
      ...(props.breakpoints ? { breakpoints: props.breakpoints } : {}),
      debug: props.debug,
      disabled: props.disabled,
      className: props.className,
      onScaleChange: (s) => {
        scale.value = s;
      },
    });

    provide(LAYOUT_ADAPTOR_KEY, {
      adaptor,
      scale,
      adaptMode: currentAdaptMode,
      direction: currentDirection,
      activeBreakpoint,
      disabled: isDisabled,
      setAdaptMode,
      setDirection,
      enable,
      disable,
      on,
      off,
    });

    onMounted(() => {
      const instance = new LayoutAdaptor(buildOptions());

      instance.on("scaleChange", (s) => emit("scaleChange", s));
      instance.on("resize", (e) => emit("resize", e));
      instance.on("render", (s) => emit("render", s));
      instance.on("start", () => emit("start"));
      instance.on("stop", () => emit("stop"));
      instance.on("ready", () => emit("ready"));
      instance.on("error", (e) => emit("error", e));
      instance.on("adaptModeChange", (m) => emit("adaptModeChange", m));
      instance.on("breakpointChange", (bp) => emit("breakpointChange", bp));
      instance.on("directionChange", (d) => emit("directionChange", d));
      instance.on("beforeRender", (s) => emit("beforeRender", s));

      instance.start();
      adaptor.value = instance;
      scale.value = instance.scale;
    });

    onUnmounted(() => {
      adaptor.value?.stop();
      adaptor.value = null;
    });

    watch(
      () => props.adaptMode,
      (mode) => {
        if (mode && adaptor.value) {
          adaptor.value.setAdaptMode(mode);
          currentAdaptMode.value = mode;
        }
      },
    );

    watch(
      () => props.direction,
      (dir) => {
        if (dir && adaptor.value) {
          adaptor.value.setDirection(dir);
          currentDirection.value = dir;
        }
      },
    );

    watch(
      () => props.disabled,
      (val) => {
        if (val) {
          disable();
        } else {
          enable();
        }
      },
    );

    watch(
      () => props.debug,
      (val) => {
        adaptor.value?.update({ debug: val });
      },
    );

    return () => slots.default?.();
  },
});
