import type {
  LayoutAdaptorOptions,
  IgnoreRule,
  LayoutAdaptorState,
  InverseTarget,
  FitMode,
  AlignX,
  AlignY,
  ScaleInfo,
  CustomFitFn,
  OverflowMode,
  AdaptMode,
  Direction,
  BreakpointConfig,
  DebugOverlayOptions,
  LayoutAdaptorEventType,
  LayoutAdaptorEventListener,
  AdaptStrategy,
} from "./type";
import { createStrategy } from "./strategies";
import { DebugOverlay } from "./debug";

let instanceCounter = 0;

function resolveTarget(target: string | HTMLElement | undefined): HTMLElement | null {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector<HTMLElement>(target);
  return target;
}

const DEFAULT_OPTIONS = {
  target: "#app",
  designWidth: 1920,
  designHeight: 1080,
  fitMode: "contain" as FitMode,
  alignX: "left" as AlignX,
  alignY: "top" as AlignY,
  resize: true,
  resizeDelay: 0,
  transition: 0,
  ignore: [] as IgnoreRule[],
  overflow: "hidden" as OverflowMode,
  minScale: 0,
  maxScale: Infinity,
  adaptMode: "scale" as AdaptMode,
  direction: "both" as Direction,
  keepDPR: false,
  rootFontSize: 16,
  breakpoints: [] as BreakpointConfig[],
  debug: false as boolean | DebugOverlayOptions,
  disabled: false,
  className: "",
};

function computeScale(
  mode: FitMode,
  viewportW: number,
  viewportH: number,
  designW: number,
  designH: number,
): number {
  const ratioX = viewportW / designW;
  const ratioY = viewportH / designH;

  switch (mode) {
    case "contain":
      return Math.min(ratioX, ratioY);
    case "cover":
      return Math.max(ratioX, ratioY);
    case "fill":
      return ratioX;
    case "width":
      return ratioX;
    case "height":
      return ratioY;
    case "crop": {
      const scaleX = viewportW / designW;
      const scaleY = viewportH / designH;
      return Math.max(scaleX, scaleY);
    }
  }
}

function computeTranslate(
  alignX: AlignX,
  alignY: AlignY,
  viewportW: number,
  viewportH: number,
  designW: number,
  designH: number,
  scale: number,
  direction: Direction,
): { x: number; y: number } {
  const renderedW = designW * scale;
  const renderedH = designH * scale;

  let x = 0;
  if (direction !== "vertical") {
    if (alignX === "center") x = (viewportW - renderedW) / 2;
    else if (alignX === "right") x = viewportW - renderedW;
  }

  let y = 0;
  if (direction !== "horizontal") {
    if (alignY === "center") y = (viewportH - renderedH) / 2;
    else if (alignY === "bottom") y = viewportH - renderedH;
  }

  return { x, y };
}

function matchBreakpoint(
  bp: BreakpointConfig,
  vw: number,
  vh: number,
): boolean {
  if (bp.minWidth !== undefined && vw < bp.minWidth) return false;
  if (bp.maxWidth !== undefined && vw > bp.maxWidth) return false;
  if (bp.minHeight !== undefined && vh < bp.minHeight) return false;
  if (bp.maxHeight !== undefined && vh > bp.maxHeight) return false;
  return true;
}

type EventListeners = {
  [K in LayoutAdaptorEventType]?: LayoutAdaptorEventListener<K>[];
};

export class LayoutAdaptor {
  private _id: string;
  private _config: Omit<typeof DEFAULT_OPTIONS, "target"> & { target: string | HTMLElement; customFit?: CustomFitFn };
  private _targetEl: HTMLElement | null = null;
  private _currentScale = 1;
  private _translateX = 0;
  private _translateY = 0;
  private _started = false;
  private _resizeObserver: ResizeObserver | null = null;
  private _resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private _inverseTargets: InverseTarget[] = [];
  private _cachedSizes = new Map<Element, { width: number; height: number }>();
  private _ignoreStyleEl: HTMLStyleElement | null = null;
  private _listeners: EventListeners = {};
  private _strategy: AdaptStrategy;
  private _activeBreakpoint: BreakpointConfig | null = null;
  private _debugOverlay: DebugOverlay | null = null;
  private _userDesignWidth: number;
  private _userDesignHeight: number;
  private _userFitMode: FitMode;

  constructor(options: LayoutAdaptorOptions = {}) {
    this._id = `la-${++instanceCounter}`;
    this._config = {
      ...DEFAULT_OPTIONS,
      ...options,
      target: options.target ?? DEFAULT_OPTIONS.target,
    };
    if (options.customFit) this._config.customFit = options.customFit;
    if (options.minScale !== undefined)
      this._config.minScale = options.minScale;
    if (options.maxScale !== undefined)
      this._config.maxScale = options.maxScale;
    if (options.rootFontSize !== undefined)
      this._config.rootFontSize = options.rootFontSize;

    this._userDesignWidth = this._config.designWidth;
    this._userDesignHeight = this._config.designHeight;
    this._userFitMode = this._config.fitMode;

    this._strategy = createStrategy(this._config.adaptMode);

    if (options.onScaleChange) {
      this.on("scaleChange", options.onScaleChange);
    }
  }

  get scale(): number {
    return this._currentScale;
  }

  get started(): boolean {
    return this._started;
  }

  get adaptMode(): AdaptMode {
    return this._config.adaptMode;
  }

  get direction(): Direction {
    return this._config.direction;
  }

  get dpr(): number {
    return this._config.keepDPR ? window.devicePixelRatio : 1;
  }

  get activeBreakpoint(): BreakpointConfig | null {
    return this._activeBreakpoint;
  }

  get state(): LayoutAdaptorState {
    return {
      scale: this._currentScale,
      started: this._started,
      designWidth: this._config.designWidth,
      designHeight: this._config.designHeight,
      fitMode: this._config.fitMode,
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight,
      translateX: this._translateX,
      translateY: this._translateY,
      adaptMode: this._config.adaptMode,
      direction: this._config.direction,
      dpr: this.dpr,
      activeBreakpoint: this._activeBreakpoint,
      rootFontSize: this._config.rootFontSize,
    };
  }

  on<T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ): this {
    if (!this._listeners[event]) {
      this._listeners[event] = [] as any;
    }
    (this._listeners[event] as any[]).push(listener);
    return this;
  }

  off<T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ): this {
    const list = this._listeners[event] as any[] | undefined;
    if (list) {
      const idx = list.indexOf(listener);
      if (idx !== -1) list.splice(idx, 1);
    }
    return this;
  }

  once<T extends LayoutAdaptorEventType>(
    event: T,
    listener: LayoutAdaptorEventListener<T>,
  ): this {
    const wrapper = ((...args: any[]) => {
      this.off(event, wrapper as any);
      (listener as any)(...args);
    }) as any;
    return this.on(event, wrapper);
  }

  setAdaptMode(mode: AdaptMode): this {
    const prev = this._config.adaptMode;
    if (prev === mode) return this;

    if (this._started && this._targetEl) {
      this._strategy.cleanup(this._targetEl);
    }

    this._config.adaptMode = mode;
    this._strategy = createStrategy(mode);

    if (this._started) {
      this._render();
    }

    this._emit("adaptModeChange", mode);
    return this;
  }

  setDirection(dir: Direction): this {
    const prev = this._config.direction;
    if (prev === dir) return this;

    this._config.direction = dir;
    if (this._started) {
      this._render();
    }

    this._emit("directionChange", dir);
    return this;
  }

  enable(): this {
    if (!this._config.disabled) return this;
    this._config.disabled = false;
    if (this._started) {
      this._targetEl = resolveTarget(this._config.target);
      if (this._targetEl) {
        if (this._config.className) {
          this._targetEl.classList.add(this._config.className);
        }
        this._render();
      }
    } else {
      this.start();
    }
    return this;
  }

  disable(): this {
    this._config.disabled = true;
    if (this._started && this._targetEl) {
      this._strategy.cleanup(this._targetEl);
      if (this._config.className) {
        this._targetEl.classList.remove(this._config.className);
      }
      this._targetEl = null;
      this._clearInverse();
      this._inverseTargets = [];
      this._cachedSizes.clear();
      this._started = false;
      this._emit("stop");
    }
    return this;
  }

  get disabled(): boolean {
    return this._config.disabled;
  }

  start(): this {
    if (this._started) return this;

    if (this._config.disabled) return this;

    this._targetEl = resolveTarget(this._config.target);
    if (!this._targetEl) {
      const err = new Error(
        `[layout-adaptor] target "${this._config.target}" not found`,
      );
      this._emit("error", err);
      return this;
    }

    if (this._config.className) {
      this._targetEl.classList.add(this._config.className);
    }

    this._started = true;
    this._initDebug();
    this._render();
    this._emit("start");
    this._emit("ready");

    if (this._config.resize) {
      this._observeResize();
    }

    return this;
  }

  stop(): this {
    if (!this._started) return this;

    this._unobserveResize();
    this._removeIgnoreStyle();
    this._destroyDebug();

    if (this._targetEl) {
      this._strategy.cleanup(this._targetEl);
      if (this._config.className) {
        this._targetEl.classList.remove(this._config.className);
      }
      this._targetEl = null;
    }

    this._clearInverse();
    this._inverseTargets = [];
    this._cachedSizes.clear();
    this._started = false;
    this._emit("stop");
    return this;
  }

  update(options: LayoutAdaptorOptions): this {
    const wasStarted = this._started;
    this.stop();

    if (options.target !== undefined) this._config.target = options.target;
    if (options.designWidth !== undefined) {
      this._config.designWidth = options.designWidth;
      this._userDesignWidth = options.designWidth;
    }
    if (options.designHeight !== undefined) {
      this._config.designHeight = options.designHeight;
      this._userDesignHeight = options.designHeight;
    }
    if (options.fitMode !== undefined) {
      this._config.fitMode = options.fitMode;
      this._userFitMode = options.fitMode;
    }
    if (options.alignX !== undefined) this._config.alignX = options.alignX;
    if (options.alignY !== undefined) this._config.alignY = options.alignY;
    if (options.resize !== undefined) this._config.resize = options.resize;
    if (options.resizeDelay !== undefined)
      this._config.resizeDelay = options.resizeDelay;
    if (options.transition !== undefined)
      this._config.transition = options.transition;
    if (options.ignore !== undefined) this._config.ignore = options.ignore;
    if (options.overflow !== undefined)
      this._config.overflow = options.overflow;
    if (options.customFit !== undefined)
      this._config.customFit = options.customFit;
    if (options.minScale !== undefined)
      this._config.minScale = options.minScale;
    if (options.maxScale !== undefined)
      this._config.maxScale = options.maxScale;
    if (options.adaptMode !== undefined) {
      this._config.adaptMode = options.adaptMode;
      this._strategy = createStrategy(options.adaptMode);
    }
    if (options.direction !== undefined)
      this._config.direction = options.direction;
    if (options.keepDPR !== undefined) this._config.keepDPR = options.keepDPR;
    if (options.rootFontSize !== undefined)
      this._config.rootFontSize = options.rootFontSize;
    if (options.breakpoints !== undefined)
      this._config.breakpoints = options.breakpoints;
    if (options.debug !== undefined) this._config.debug = options.debug;
    if (options.disabled !== undefined)
      this._config.disabled = options.disabled;
    if (options.className !== undefined)
      this._config.className = options.className;

    if (options.onScaleChange) {
      this.on("scaleChange", options.onScaleChange);
    }

    if (wasStarted) this.start();
    return this;
  }

  inverseScale(selector: string, level = 1): this {
    if (!this._started || !this._targetEl) return this;

    const existing = this._inverseTargets.find((t) => t.selector === selector);
    if (existing) {
      existing.level = level;
    } else {
      this._inverseTargets.push({ selector, level });
    }

    this._applyInverse();
    return this;
  }

  resetInverse(selector: string): this {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (this._cachedSizes.has(el)) {
        const htmlEl = el as HTMLElement;
        htmlEl.style.width = "";
        htmlEl.style.height = "";
        htmlEl.style.transform = "";
        htmlEl.style.transformOrigin = "";
        htmlEl.style.zoom = "";
        htmlEl.style.fontSize = "";
        this._cachedSizes.delete(el);
      }
    });

    this._inverseTargets = this._inverseTargets.filter(
      (t) => t.selector !== selector,
    );
    return this;
  }

  private _resolveScale(viewportW: number, viewportH: number): number {
    const {
      fitMode,
      designWidth,
      designHeight,
      customFit,
      minScale,
      maxScale,
    } = this._config;

    let scale: number;

    if (customFit) {
      const info: ScaleInfo = {
        ratioX: viewportW / designWidth,
        ratioY: viewportH / designHeight,
        viewportW,
        viewportH,
        designW: designWidth,
        designH: designHeight,
        fitMode,
      };
      scale = customFit(info);
    } else {
      scale = computeScale(
        fitMode,
        viewportW,
        viewportH,
        designWidth,
        designHeight,
      );
    }

    return Math.min(maxScale, Math.max(minScale, scale));
  }

  private _resolveBreakpoint(
    viewportW: number,
    viewportH: number,
  ): BreakpointConfig | null {
    const bps = this._config.breakpoints;
    if (!bps || bps.length === 0) return null;

    for (const bp of bps) {
      if (matchBreakpoint(bp, viewportW, viewportH)) {
        return bp;
      }
    }
    return null;
  }

  private _render(): void {
    if (!this._targetEl) return;

    const viewportW = document.documentElement.clientWidth;
    const viewportH = document.documentElement.clientHeight;

    const bp = this._resolveBreakpoint(viewportW, viewportH);
    const prevBp = this._activeBreakpoint;
    this._activeBreakpoint = bp;

    if (bp) {
      this._config.designWidth = bp.designWidth ?? this._userDesignWidth;
      this._config.designHeight = bp.designHeight ?? this._userDesignHeight;
      this._config.fitMode = bp.fitMode ?? this._userFitMode;
    } else {
      this._config.designWidth = this._userDesignWidth;
      this._config.designHeight = this._userDesignHeight;
      this._config.fitMode = this._userFitMode;
    }

    if (bp !== prevBp) {
      this._emit("breakpointChange", bp);
    }

    const designW = this._config.designWidth;
    const designH = this._config.designHeight;

    this._currentScale = this._resolveScale(viewportW, viewportH);

    const { x, y } = computeTranslate(
      this._config.alignX,
      this._config.alignY,
      viewportW,
      viewportH,
      designW,
      designH,
      this._currentScale,
      this._config.direction,
    );
    this._translateX = x;
    this._translateY = y;

    const pendingState = this.state;
    this._emit("beforeRender", pendingState);

    this._strategy.apply(this._targetEl, {
      scale: this._currentScale,
      translateX: x,
      translateY: y,
      designW,
      designH,
      viewportW,
      viewportH,
      direction: this._config.direction,
      overflow: this._config.overflow,
      transition: this._config.transition,
      dpr: this.dpr,
      rootFontSize: this._config.rootFontSize,
    });

    this._syncIgnoreStyle();

    if (this._inverseTargets.length > 0) {
      this._applyInverse();
    }

    this._emit("scaleChange", this._currentScale);
    this._emit("render", this.state);

    if (this._debugOverlay) {
      this._debugOverlay.update(this.state);
    }
  }

  private _observeResize(): void {
    this._resizeObserver = new ResizeObserver(() => {
      if (this._resizeTimer) clearTimeout(this._resizeTimer);

      const viewportW = document.documentElement.clientWidth;
      const viewportH = document.documentElement.clientHeight;

      this._emit("resize", { viewportW, viewportH });

      if (this._config.resizeDelay > 0) {
        this._resizeTimer = setTimeout(
          () => this._render(),
          this._config.resizeDelay,
        );
      } else {
        this._render();
      }
    });
    this._resizeObserver.observe(document.documentElement);
  }

  private _unobserveResize(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._resizeTimer) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = null;
    }
  }

  private _syncIgnoreStyle(): void {
    if (this._config.ignore.length === 0) {
      this._removeIgnoreStyle();
      return;
    }

    if (!this._ignoreStyleEl) {
      this._ignoreStyleEl = document.createElement("style");
      this._ignoreStyleEl.setAttribute("data-la", this._id);
      document.head.appendChild(this._ignoreStyleEl);
    }

    const rules = this._config.ignore.map((rule) => {
      const s = rule.scale ?? 1 / this._currentScale;
      const fs = rule.fontSize ? `${rule.fontSize}px` : "inherit";
      const w = rule.width ?? "auto";
      const h = rule.height ?? "auto";

      const parts = [
        `${rule.selector}{transform:scale(${s})!important;transform-origin:0 0;width:${w}!important;height:${h}!important;}`,
      ];
      if (rule.fontSize) {
        parts.push(`${rule.selector} *{font-size:${fs}!important;}`);
      }
      return parts.join("");
    });

    this._ignoreStyleEl.textContent = rules.join("");
  }

  private _removeIgnoreStyle(): void {
    if (this._ignoreStyleEl) {
      this._ignoreStyleEl.remove();
      this._ignoreStyleEl = null;
    }
  }

  private _applyInverse(): void {
    for (const { selector, level } of this._inverseTargets) {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        if (!this._cachedSizes.has(el)) {
          this._cachedSizes.set(el, {
            width: el.offsetWidth,
            height: el.offsetHeight,
          });
        }

        const orig = this._cachedSizes.get(el)!;

        if (this._strategy.inverseScale) {
          this._strategy.inverseScale(
            el,
            this._currentScale,
            orig.width,
            orig.height,
            level,
            this.dpr,
            this._config.rootFontSize,
          );
        }
      });
    }
  }

  private _clearInverse(): void {
    this._cachedSizes.forEach((_orig, el) => {
      if (el instanceof HTMLElement) {
        el.style.width = "";
        el.style.height = "";
        el.style.transform = "";
        el.style.transformOrigin = "";
        el.style.zoom = "";
        el.style.fontSize = "";
      }
    });
    this._cachedSizes.clear();
  }

  private _initDebug(): void {
    const debug = this._config.debug;
    if (!debug) return;

    const opts: DebugOverlayOptions =
      typeof debug === "object" ? debug : { enabled: true };

    this._debugOverlay = new DebugOverlay(opts);
    this._debugOverlay.mount();
  }

  private _destroyDebug(): void {
    if (this._debugOverlay) {
      this._debugOverlay.destroy();
      this._debugOverlay = null;
    }
  }

  private _emit<T extends LayoutAdaptorEventType>(
    event: T,
    ...args: Parameters<LayoutAdaptorEventListener<T>>
  ): void {
    const list = this._listeners[event] as any[] | undefined;
    if (list) {
      for (const fn of list.slice()) {
        try {
          fn(...args);
        } catch (e) {
          this._emit("error", e instanceof Error ? e : new Error(String(e)));
        }
      }
    }
  }
}
