<script setup lang="ts">
import { LayoutAdaptor, type FitMode } from "@tinyforged/layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const modes: FitMode[] = ["contain", "cover", "fill", "width", "height", "crop"];
const currentMode = ref<FitMode>("contain");
const scale = ref(1);
let adaptor: LayoutAdaptor | null = null;

const modeDescriptions: Record<FitMode, string> = {
  contain: "等比缩放，完整显示，可能留白",
  cover: "等比缩放，填满视口，可能裁切",
  fill: "拉伸填满，不保持比例",
  width: "仅按宽度等比缩放",
  height: "仅按高度等比缩放",
  crop: "等比填满 + overflow hidden 居中裁切",
};

const switchMode = (mode: FitMode) => {
  currentMode.value = mode;
  if (adaptor) {
    adaptor.update({ fitMode: mode });
    scale.value = adaptor.scale;
  }
};

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    fitMode: "contain",
    alignX: "center",
    alignY: "center",
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
    <div class="content">
      <h1>FitMode 适配模式</h1>
      <p>拖动浏览器窗口，观察不同适配模式下的表现差异</p>
      <div class="modes">
        <button
          v-for="m in modes"
          :key="m"
          :class="{ active: currentMode === m }"
          @click="switchMode(m)"
        >
          {{ m }}
        </button>
      </div>
      <div class="info-row">
        <div class="info-box">
          <span class="label">当前模式</span>
          <span class="val">{{ currentMode }}</span>
        </div>
        <div class="info-box">
          <span class="label">scale</span>
          <span class="val">{{ scale.toFixed(4) }}</span>
        </div>
        <div class="info-box desc-box">
          <span class="label">说明</span>
          <span class="val desc">{{ modeDescriptions[currentMode] }}</span>
        </div>
      </div>
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
p { font-size: 18px; color: #888; margin-bottom: 32px; }
.modes { display: flex; gap: 10px; justify-content: center; margin-bottom: 32px; }
.modes button {
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  font-family: monospace;
  transition: all 0.2s;
}
.modes button:hover { background: rgba(0, 88, 255, 0.1); color: #fff; }
.modes button.active {
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  color: #fff;
  border-color: transparent;
}
.info-row { display: flex; gap: 16px; justify-content: center; }
.info-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 20px;
  background: rgba(0, 88, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(0, 88, 255, 0.15);
  text-align: left;
}
.desc-box { max-width: 320px; }
.label { font-size: 11px; color: #666; text-transform: uppercase; }
.val { font-size: 18px; color: #41d1ff; font-weight: 600; font-variant-numeric: tabular-nums; }
.val.desc { font-size: 14px; font-weight: 400; color: #aaa; }
</style>
