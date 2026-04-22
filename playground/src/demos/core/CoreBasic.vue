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
    <div class="center-box">
      <h1>1920 × 1080</h1>
      <p>默认 contain 模式 — 等比缩放，完整显示设计稿内容</p>
      <div class="scale-info">scale: {{ scale.toFixed(4) }}</div>
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
  font-size: 48px;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}
p { font-size: 20px; color: #888; }
.scale-info {
  margin-top: 20px;
  font-size: 16px;
  color: #41d1ff;
  padding: 8px 20px;
  background: rgba(0, 88, 255, 0.1);
  border-radius: 8px;
  display: inline-block;
  font-variant-numeric: tabular-nums;
}
</style>
