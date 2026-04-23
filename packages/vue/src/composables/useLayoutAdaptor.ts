import { nextTick, onMounted, onUnmounted, ref, shallowRef, type Ref, unref } from 'vue';
import {
  LayoutAdaptor,
  type LayoutAdaptorOptions,
  type LayoutAdaptorEventType,
  type LayoutAdaptorEventListener,
  type AdaptMode,
  type Direction,
  type BreakpointConfig
} from '@tinyforged/layout-adaptor';

export type UseLayoutAdaptorOptions = Omit<LayoutAdaptorOptions, 'target'> & {
  target?: string | Ref<HTMLElement | undefined> | HTMLElement;
};

export interface UseLayoutAdaptorReturn {
  scale: Ref<number>;
  started: Ref<boolean>;
  adaptor: Ref<LayoutAdaptor | null>;
  adaptMode: Ref<AdaptMode>;
  direction: Ref<Direction>;
  activeBreakpoint: Ref<BreakpointConfig | null>;
  disabled: Ref<boolean>;
  update: (options: Partial<LayoutAdaptorOptions>) => void;
  setAdaptMode: (mode: AdaptMode) => void;
  setDirection: (dir: Direction) => void;
  enable: () => void;
  disable: () => void;
  on: <T extends LayoutAdaptorEventType>(event: T, listener: LayoutAdaptorEventListener<T>) => void;
  off: <T extends LayoutAdaptorEventType>(event: T, listener: LayoutAdaptorEventListener<T>) => void;
}

function resolveVueTarget(
  target: string | Ref<HTMLElement | undefined> | HTMLElement | undefined
): string | HTMLElement | undefined {
  if (!target) return undefined;
  return unref(target) ?? undefined;
}

export function useLayoutAdaptor(
  options: UseLayoutAdaptorOptions | Ref<UseLayoutAdaptorOptions>
): UseLayoutAdaptorReturn {
  const adaptor = shallowRef<LayoutAdaptor | null>(null);
  const scale = ref(1);
  const started = ref(false);
  const adaptMode = ref<AdaptMode>('scale');
  const direction = ref<Direction>('both');
  const activeBreakpoint = ref<BreakpointConfig | null>(null);
  const isDisabled = ref(false);

  const resolveOptions = (): UseLayoutAdaptorOptions =>
    options && typeof options === 'object' && 'value' in options ? options.value : (options as UseLayoutAdaptorOptions);

  const syncState = () => {
    if (!adaptor.value) return;
    scale.value = adaptor.value.scale;
    started.value = adaptor.value.started;
    adaptMode.value = adaptor.value.adaptMode;
    direction.value = adaptor.value.direction;
    activeBreakpoint.value = adaptor.value.activeBreakpoint;
    isDisabled.value = adaptor.value.disabled;
  };

  const update = (patch: Partial<LayoutAdaptorOptions>) => {
    if (!adaptor.value) return;
    const resolved = resolveOptions();
    adaptor.value.update({ ...resolved, target: resolveVueTarget(resolved.target), ...patch });
    syncState();
  };

  const setAdaptMode = (mode: AdaptMode) => {
    adaptor.value?.setAdaptMode(mode);
    syncState();
  };

  const setDirection = (dir: Direction) => {
    adaptor.value?.setDirection(dir);
    syncState();
  };

  const enable = () => {
    adaptor.value?.enable();
    syncState();
  };

  const disable = () => {
    adaptor.value?.disable();
    syncState();
  };

  const on = <T extends LayoutAdaptorEventType>(event: T, listener: LayoutAdaptorEventListener<T>) => {
    adaptor.value?.on(event, listener);
  };

  const off = <T extends LayoutAdaptorEventType>(event: T, listener: LayoutAdaptorEventListener<T>) => {
    adaptor.value?.off(event, listener);
  };

  onMounted(async () => {
    const resolved = resolveOptions();
    const instance = new LayoutAdaptor({
      ...resolved,
      target: resolveVueTarget(resolved.target),
      onScaleChange: s => {
        scale.value = s;
      }
    });

    instance.on('breakpointChange', bp => {
      activeBreakpoint.value = bp;
    });

    instance.on('adaptModeChange', mode => {
      adaptMode.value = mode;
    });

    instance.on('directionChange', dir => {
      direction.value = dir;
    });

    instance.start();
    adaptor.value = instance;
    syncState();

    if (!instance.started) {
      await nextTick();
      instance.start();
      syncState();
    }
  });

  onUnmounted(() => {
    adaptor.value?.stop();
    adaptor.value = null;
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
    off
  };
}
