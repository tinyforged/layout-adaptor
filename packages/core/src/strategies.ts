import type { AdaptStrategy, Direction, OverflowMode } from "./type";

interface StrategyApplyInfo {
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
}

function applyTransition(el: HTMLElement, transition: number, props: string[]) {
  if (transition > 0) {
    el.style.transition = props
      .map((p) => `${p} ${transition}s ease-out`)
      .join(", ");
  }
}

export class ScaleStrategy implements AdaptStrategy {
  apply(el: HTMLElement, info: StrategyApplyInfo): void {
    const {
      scale,
      translateX,
      translateY,
      designW,
      designH,
      direction,
      overflow,
      transition,
    } = info;

    el.style.width = `${designW}px`;
    el.style.height = `${designH}px`;

    if (direction === "horizontal") {
      el.style.transform = `translate(${translateX}px, 0) scale(${scale}, 1)`;
    } else if (direction === "vertical") {
      el.style.transform = `translate(0, ${translateY}px) scale(1, ${scale})`;
    } else {
      el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    el.style.transformOrigin = "0 0";
    el.style.overflow = overflow;
    applyTransition(el, transition, ["transform"]);
  }

  cleanup(el: HTMLElement): void {
    el.style.width = "";
    el.style.height = "";
    el.style.transform = "";
    el.style.transformOrigin = "";
    el.style.overflow = "";
    el.style.transition = "";
  }

  inverseScale(
    el: HTMLElement,
    scale: number,
    origW: number,
    origH: number,
    level: number,
  ): void {
    const inverse = (1 / scale) * level;
    el.style.width = `${origW * inverse}px`;
    el.style.height = `${origH * inverse}px`;
    el.style.transform = `scale(${inverse})`;
    el.style.transformOrigin = "0 0";
  }
}

export class RemStrategy implements AdaptStrategy {
  private _origRootFontSize: string = "";
  private _origElFontSize: string = "";

  apply(el: HTMLElement, info: StrategyApplyInfo): void {
    const {
      scale,
      designW,
      viewportW,
      direction,
      overflow,
      transition,
      rootFontSize,
    } = info;

    const baseFontSize = rootFontSize || 16;
    const targetFontSize = baseFontSize * scale;

    const htmlEl = document.documentElement;
    this._origRootFontSize = htmlEl.style.fontSize;
    this._origElFontSize = el.style.fontSize;

    if (direction === "horizontal" || direction === "both") {
      htmlEl.style.fontSize = `${targetFontSize}px`;
    }

    el.style.width = direction === "vertical" ? `${designW}px` : "auto";
    el.style.overflow = overflow;
    el.style.boxSizing = "border-box";

    if (direction === "vertical") {
      el.style.minHeight = "100vh";
    }

    applyTransition(el, transition, ["font-size", "width"]);
  }

  cleanup(el: HTMLElement): void {
    document.documentElement.style.fontSize = this._origRootFontSize;
    el.style.fontSize = this._origElFontSize;
    el.style.width = "";
    el.style.overflow = "";
    el.style.boxSizing = "";
    el.style.minHeight = "";
    el.style.transition = "";
  }

  inverseScale(
    el: HTMLElement,
    scale: number,
    origW: number,
    origH: number,
    level: number,
  ): void {
    const inverse = (1 / scale) * level;
    el.style.fontSize = `${inverse * 16}px`;
  }
}

export class VwvhStrategy implements AdaptStrategy {
  apply(el: HTMLElement, info: StrategyApplyInfo): void {
    const {
      designW,
      designH,
      direction,
      overflow,
      transition,
      viewportW,
      viewportH,
    } = info;

    const vw = 100 / designW;
    const vh = 100 / designH;

    if (direction === "horizontal" || direction === "both") {
      el.style.width = "100vw";
      el.style.maxWidth = "100vw";
    } else {
      el.style.width = `${designW * (viewportW / designW)}px`;
    }

    if (direction === "vertical" || direction === "both") {
      el.style.height = "100vh";
      el.style.maxHeight = "100vh";
    } else {
      el.style.height = `${designH * (viewportH / designH)}px`;
    }

    el.style.overflow = overflow;
    el.style.boxSizing = "border-box";

    el.style.setProperty("--la-vw", `${vw}vw`);
    el.style.setProperty("--la-vh", `${vh}vh`);

    applyTransition(el, transition, ["width", "height"]);
  }

  cleanup(el: HTMLElement): void {
    el.style.width = "";
    el.style.maxWidth = "";
    el.style.height = "";
    el.style.maxHeight = "";
    el.style.overflow = "";
    el.style.boxSizing = "";
    el.style.transition = "";
    el.style.removeProperty("--la-vw");
    el.style.removeProperty("--la-vh");
  }

  inverseScale(
    el: HTMLElement,
    scale: number,
    origW: number,
    origH: number,
    level: number,
  ): void {
    const inverse = (1 / scale) * level;
    el.style.width = `${origW * inverse}px`;
    el.style.height = `${origH * inverse}px`;
    el.style.transform = `scale(${inverse})`;
    el.style.transformOrigin = "0 0";
  }
}

export class ZoomStrategy implements AdaptStrategy {
  apply(el: HTMLElement, info: StrategyApplyInfo): void {
    const {
      scale,
      translateX,
      translateY,
      designW,
      designH,
      direction,
      overflow,
      transition,
    } = info;

    el.style.width = `${designW}px`;
    el.style.height = `${designH}px`;

    if (direction === "horizontal") {
      el.style.zoom = `${scale}`;
      el.style.transform = `translateX(${translateX}px)`;
    } else if (direction === "vertical") {
      el.style.zoom = `${scale}`;
      el.style.transform = `translateY(${translateY}px)`;
    } else {
      el.style.zoom = `${scale}`;
      el.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    el.style.transformOrigin = "0 0";
    el.style.overflow = overflow;
    applyTransition(el, transition, ["zoom", "transform"]);
  }

  cleanup(el: HTMLElement): void {
    el.style.width = "";
    el.style.height = "";
    el.style.zoom = "";
    el.style.transform = "";
    el.style.transformOrigin = "";
    el.style.overflow = "";
    el.style.transition = "";
  }

  inverseScale(
    el: HTMLElement,
    scale: number,
    origW: number,
    origH: number,
    level: number,
  ): void {
    const inverse = (1 / scale) * level;
    el.style.zoom = `${inverse}`;
    el.style.width = `${origW}px`;
    el.style.height = `${origH}px`;
  }
}

export function createStrategy(mode: string): AdaptStrategy {
  switch (mode) {
    case "rem":
      return new RemStrategy();
    case "vwvh":
      return new VwvhStrategy();
    case "zoom":
      return new ZoomStrategy();
    case "scale":
    default:
      return new ScaleStrategy();
  }
}
