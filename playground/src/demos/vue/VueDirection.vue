<script setup lang="ts">
import { LayoutAdaptor, type BreakpointConfig } from "@tinyforged/layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const viewportW = ref(0);
const activeBreakpoint = ref<BreakpointConfig | null>(null);
let adaptor: LayoutAdaptor | null = null;

const breakpoints: BreakpointConfig[] = [
  { minWidth: 0, maxWidth: 768, designWidth: 1366, designHeight: 768 },
  { minWidth: 768, maxWidth: 1200, designWidth: 1600, designHeight: 900 },
  { minWidth: 1200, designWidth: 1920, designHeight: 1080 },
];

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    breakpoints,
    resize: true,
    onScaleChange: (s) => {
      scale.value = s;
    },
  });
  adaptor.on("breakpointChange", (bp) => {
    activeBreakpoint.value = bp;
  });
  adaptor.on("resize", ({ viewportW: w }) => {
    viewportW.value = w;
  });
  adaptor.start();
  scale.value = adaptor.scale;
  activeBreakpoint.value = adaptor.activeBreakpoint;
  viewportW.value = document.documentElement.clientWidth;
});

onUnmounted(() => {
  adaptor?.stop();
});
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <div class="panel">
        <div class="label">当前缩放: {{ scale.toFixed(4) }}</div>
        <div class="label">视口宽度: {{ viewportW }}px</div>
      </div>
      <div class="panel bp-info">
        <div class="label">当前断点</div>
        <div v-if="activeBreakpoint" class="bp-detail">
          <p>
            范围: {{ activeBreakpoint.minWidth }}px ~
            {{ activeBreakpoint.maxWidth || "∞" }}px
          </p>
          <p>
            设计稿: {{ activeBreakpoint.designWidth }} x
            {{ activeBreakpoint.designHeight }}
          </p>
        </div>
        <div v-else class="bp-detail">
          <p>无匹配断点，使用默认设计稿 1920x1080</p>
        </div>
      </div>
      <div class="panel">
        <div class="label">断点配置</div>
        <div class="bp-list">
          <div v-for="(bp, i) in breakpoints" :key="i" class="bp-item">
            {{ bp.minWidth }}-{{ bp.maxWidth || "∞" }} →
            {{ bp.designWidth }}x{{ bp.designHeight }}
          </div>
        </div>
      </div>
      <p class="hint">调整浏览器窗口大小，观察断点自动切换</p>
    </div>
  </div>
</template>

<style scoped>
.area {
  width: 1920px;
  height: 1080px;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  text-align: center;
}
.panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
}
.label {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
}
.bp-info {
  border-color: rgba(251, 191, 36, 0.3);
}
.bp-detail {
  font-size: 14px;
  color: #fbbf24;
}
.bp-detail p {
  margin: 4px 0;
}
.bp-list {
  text-align: left;
}
.bp-item {
  font-size: 13px;
  color: #aaa;
  margin: 6px 0;
  font-family: monospace;
}
.hint {
  margin-top: 20px;
  font-size: 13px;
  color: #555;
}
</style>
