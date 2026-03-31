<script setup lang="ts">
import { useLayoutAdaptorInject } from "layout-adaptor-vue";

defineProps<{
  lastScale: number | null;
  lastResize: string | null;
  started: boolean;
}>();

const { scale } = useLayoutAdaptorInject();
</script>

<template>
  <div class="center-box">
    <h1>&lt;LayoutAdaptorProvider&gt;</h1>
    <p>本页面通过 Provider 组件包裹，自动初始化布局适配</p>
    <div class="info">
      <div class="tag">Provider 组件方式</div>
      <div class="tag">自动 mount/unmount</div>
      <div class="tag">Props 配置</div>
      <div class="tag highlight">事件 emits</div>
    </div>
    <div class="event-panel">
      <div class="event-row">
        <span class="evt-label">@scale-change</span>
        <span class="evt-val">{{ lastScale !== null ? lastScale.toFixed(4) : "等待中..." }}</span>
      </div>
      <div class="event-row">
        <span class="evt-label">@resize</span>
        <span class="evt-val">{{ lastResize || "等待中..." }}</span>
      </div>
      <div class="event-row">
        <span class="evt-label">@start</span>
        <span class="evt-val">{{ started ? "已触发 ✓" : "等待中..." }}</span>
      </div>
      <div class="event-row">
        <span class="evt-label">inject scale</span>
        <span class="evt-val">{{ scale.toFixed(4) }}</span>
      </div>
    </div>
    <div class="code-hint">
      拖动窗口观察事件变化 — 父组件通过 @event 监听，子组件通过 useLayoutAdaptorInject 获取
    </div>
  </div>
</template>

<style scoped>
.center-box {
  text-align: center;
  padding: 60px 80px;
  border: 1px solid rgba(0, 88, 255, 0.2);
  border-radius: 20px;
  background: rgba(0, 88, 255, 0.05);
}
h1 {
  font-size: 38px;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  font-family: monospace;
}
p {
  font-size: 18px;
  color: #888;
  margin-bottom: 32px;
}
.info {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}
.tag {
  padding: 6px 16px;
  border-radius: 6px;
  background: rgba(0, 88, 255, 0.1);
  border: 1px solid rgba(0, 88, 255, 0.2);
  color: #60a5fa;
  font-size: 13px;
}
.tag.highlight {
  background: rgba(52, 211, 153, 0.12);
  border-color: rgba(52, 211, 153, 0.25);
  color: #34d399;
}
.event-panel {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
.event-row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 8px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  min-width: 360px;
}
.evt-label {
  font-size: 13px;
  color: #888;
  font-family: monospace;
  min-width: 140px;
  text-align: left;
}
.evt-val {
  font-size: 14px;
  color: #41d1ff;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.code-hint {
  font-size: 14px;
  color: #555;
}
</style>
