import type { DebugOverlayOptions, LayoutAdaptorState } from "./type";

const POS_MAP: Record<string, { top: string; right: string; bottom: string; left: string }> = {
  "top-left": { top: "8px", right: "auto", bottom: "auto", left: "8px" },
  "top-right": { top: "8px", right: "8px", bottom: "auto", left: "auto" },
  "bottom-left": { top: "auto", right: "auto", bottom: "8px", left: "8px" },
  "bottom-right": { top: "auto", right: "8px", bottom: "8px", left: "auto" },
};

export class DebugOverlay {
  private _el: HTMLDivElement | null = null;
  private _opts: Required<DebugOverlayOptions>;

  constructor(opts: DebugOverlayOptions = {}) {
    this._opts = {
      enabled: opts.enabled ?? true,
      color: opts.color ?? "rgba(0,120,255,0.85)",
      position: opts.position ?? "top-right",
      showGrid: opts.showGrid ?? false,
    };
  }

  mount(): void {
    if (this._el || !this._opts.enabled) return;

    const el = document.createElement("div");
    el.setAttribute("data-la-debug", "");

    const pos = POS_MAP[this._opts.position];

    Object.assign(el.style, {
      position: "fixed",
      zIndex: "99999",
      top: pos.top,
      right: pos.right,
      bottom: pos.bottom,
      left: pos.left,
      background: this._opts.color,
      color: "#fff",
      padding: "6px 10px",
      borderRadius: "4px",
      fontFamily: "monospace",
      fontSize: "11px",
      lineHeight: "1.5",
      pointerEvents: "none",
      whiteSpace: "pre",
      maxWidth: "320px",
      wordBreak: "break-all",
    });

    document.body.appendChild(el);
    this._el = el;
  }

  update(state: LayoutAdaptorState): void {
    if (!this._el) return;

    const lines = [
      `scale: ${state.scale.toFixed(4)}`,
      `viewport: ${state.viewportWidth}×${state.viewportHeight}`,
      `design: ${state.designWidth}×${state.designHeight}`,
      `mode: ${state.adaptMode} | dir: ${state.direction}`,
      `fit: ${state.fitMode} | dpr: ${state.dpr}`,
      `translate: (${state.translateX.toFixed(1)}, ${state.translateY.toFixed(
        1,
      )})`,
    ];

    if (state.activeBreakpoint) {
      const bp = state.activeBreakpoint;
      const range = [
        bp.minWidth ? `≥${bp.minWidth}` : "",
        bp.maxWidth ? `≤${bp.maxWidth}` : "",
      ]
        .filter(Boolean)
        .join(" & ");
      lines.push(`breakpoint: ${range || "active"}`);
    }

    this._el.textContent = lines.join("\n");
  }

  destroy(): void {
    if (this._el) {
      this._el.remove();
      this._el = null;
    }
  }
}
