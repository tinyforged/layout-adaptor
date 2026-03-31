<script setup lang="ts">
import { useLayoutAdaptor } from "layout-adaptor-vue";
import { ref } from "vue";

const { scale, running } = useLayoutAdaptor({
  target: "#demo-area",
  designWidth: 1920,
  designHeight: 1080,
  resize: true,
});

const vpWidth = ref(window.innerWidth);
const vpHeight = ref(window.innerHeight);
window.addEventListener("resize", () => {
  vpWidth.value = window.innerWidth;
  vpHeight.value = window.innerHeight;
});
</script>

<template>
  <div id="demo-area" class="area">
    <div class="center-box">
      <h1>useLayoutAdaptor()</h1>
      <p>Vue 3 Composable Hook 自动管理生命周期</p>
      <div class="stats">
        <div class="stat"><span class="stat-key">scale</span><span class="stat-val">{{ scale.toFixed(4) }}</span></div>
        <div class="stat"><span class="stat-key">running</span><span class="stat-val">{{ running }}</span></div>
        <div class="stat"><span class="stat-key">viewport</span><span class="stat-val">{{ vpWidth }}×{{ vpHeight }}</span></div>
      </div>
      <div class="tip">拖动浏览器窗口，观察响应式缩放效果</div>
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
.center-box {
  text-align: center;
  padding: 60px 80px;
  border: 1px solid rgba(0, 88, 255, 0.2);
  border-radius: 20px;
  background: rgba(0, 88, 255, 0.05);
}
h1 {
  font-size: 42px;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  font-family: monospace;
}
p { font-size: 18px; color: #888; margin-bottom: 32px; }
.stats { display: flex; gap: 32px; justify-content: center; margin-bottom: 24px; }
.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 20px;
  background: rgba(0, 88, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(0, 88, 255, 0.15);
}
.stat-key { font-size: 11px; color: #666; text-transform: uppercase; }
.stat-val { font-size: 18px; color: #41d1ff; font-weight: 600; font-variant-numeric: tabular-nums; }
.tip { font-size: 14px; color: #555; }
</style>
