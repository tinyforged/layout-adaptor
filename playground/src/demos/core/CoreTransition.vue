<script setup lang="ts">
import { LayoutAdaptor } from "@tinyforged/layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
let adaptor: LayoutAdaptor | null = null;

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    resize: true,
    transition: 0.3,
    resizeDelay: 200,
    onScaleChange: (s) => {
      scale.value = s;
    },
  });
  adaptor.start();
  scale.value = adaptor.scale;
});

onUnmounted(() => {
  adaptor?.stop();
});
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <h1>Smooth Transition</h1>
      <p>拖动窗口边缘，观察 0.3s 过渡动画效果</p>
      <div class="params">
        <div class="param"><span class="key">transition</span><span class="val">0.3s</span></div>
        <div class="param"><span class="key">resizeDelay</span><span class="val">200ms</span></div>
      </div>
      <div class="scale-bar">
        <div class="fill" :style="{ width: Math.min(scale * 100, 100) + '%' }"></div>
      </div>
      <div class="scale-label">{{ scale.toFixed(4) }}</div>
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
.content { text-align: center; }
h1 {
  font-size: 48px;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}
p { font-size: 18px; color: #888; margin-bottom: 40px; }
.params { display: flex; gap: 24px; justify-content: center; margin-bottom: 32px; }
.param {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  font-size: 14px;
}
.key { color: #888; }
.val { color: #41d1ff; font-weight: 600; font-family: monospace; }
.scale-bar {
  width: 400px;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto 12px;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, #0058ff, #41d1ff);
  border-radius: 5px;
  transition: width 0.15s;
}
.scale-label { font-size: 20px; color: #41d1ff; font-family: monospace; font-variant-numeric: tabular-nums; }
</style>
