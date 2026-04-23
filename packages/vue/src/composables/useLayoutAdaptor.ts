import { onMounted, onUnmounted, ref, type Ref, unref } from "vue";
import {
  LayoutAdaptor,
  type LayoutAdaptorOptions,
  type LayoutAdaptorEventType,
  type LayoutAdaptorEventListener,
  type AdaptMode,
  type Direction,
  type BreakpointConfig,
} from "@tinyforged/layout-adaptor";

export interface UseLayoutAdaptorOptions
  extends Omit<LayoutAdaptorOptions, "target"> {
  target?: string | Ref<HTMLElement | undefined> | HTMLElement;
}

export interface UseLayoutAdaptorReturn {
  scale: Ref<number>;
  started: Ref<boolean>;
  adaptor: Ref<LayoutAdaptor>;
  adaptMode: Ref<AdaptMode>;
  direction: Ref<Direction>;
  activeBreakpoint: Ref<BreakpointConfig | null>;
  disabled: Ref<boolean>;
  update: (options: Partial<LayoutAdaptorOptions>) => void;
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

function resolveVueTarget(
  target: string | Ref<HTMLElement | undefined> | HTMLElement | undefined,
): string | HTMLElement | undefined {
  if (!target) return undefined;
  return unref(target) ?? undefined;
}

export function useLayoutAdaptor(
  options: UseLayoutAdaptorOptions | Ref<UseLayoutAdaptorOptions>,
): UseLayoutAdaptorReturn {
  const adaptor = ref(new LayoutAdaptor()) as Ref<LayoutAdaptor>;
  const scale = ref(1);
  const started = ref(false);
  const adaptMode = ref<AdaptMode>("scale");
  const direction = ref<Direction>("both");
  const activeBreakpoint = ref<BreakpointConfig | null>(null);
  const isDisabled = ref(false);

  const resolveOptions = (): UseLayoutAdaptorOptions =>
    options && typeof options === "object" && "value" in options
      ? options.value
      : (options as UseLayoutAdaptorOptions);

  const syncState = () => {
    scale.value = adaptor.value.scale;
    started.value = adaptor.value.started;
    adaptMode.value = adaptor.value.adaptMode;
    direction.value = adaptor.value.direction;
    activeBreakpoint.value = adaptor.value.activeBreakpoint;
  };

  const update = (patch: Partial<LayoutAdaptorOptions>) => {
    const resolved = resolveOptions();
    adaptor.value.update({ ...resolved, target: resolveVueTarget(resolved.target), ...patch });
    syncState();
  };

  const setAdaptMode = (mode: AdaptMode) => {
    adaptor.value.setAdaptMode(mode);
    adaptMode.value = mode;
  };

  const setDirection = (dir: Direction) => {
    adaptor.value.setDirection(dir);
    direction.value = dir;
  };

  const enable = () => {
    adaptor.value.enable();
    isDisabled.value = false;
    syncState();
  };

  const disable = () => {
    adaptor.value.disable();
    isDisabled.value = true;
  };

  const on = <T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ) => {
    adaptor.value.on(event, listener);
  };

  const off = <T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ) => {
    adaptor.value.off(event, listener);
  };

  onMounted(() => {
    const resolved = resolveOptions();
    const instance = new LayoutAdaptor({
      ...resolved,
      target: resolveVueTarget(resolved.target),
      onScaleChange: (s) => {
        scale.value = s;
      },
    });

    instance.on("breakpointChange", (bp) => {
      activeBreakpoint.value = bp;
    });

    instance.start();
    adaptor.value = instance;
    syncState();
  });

  onUnmounted(() => {
    adaptor.value.stop();
    started.value = false;
  });

  return {
    scale,
    started,
    adaptor,
    adaptMode,
    direction,
    activeBreakpoint,
    disabled: isDisabled,
    update,
    setAdaptMode,
    setDirection,
    enable,
    disable,
    on,
    off,
  };
}
