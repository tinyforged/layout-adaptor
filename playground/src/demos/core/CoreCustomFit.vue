<script setup lang="ts">
import { LayoutAdaptor } from "@tinyforged/layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const rawRatioX = ref(1);
const rawRatioY = ref(1);
const customScale = ref(1);
let adaptor: LayoutAdaptor | null = null;

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    resize: true,
    customFit: (info) => {
      rawRatioX.value = info.ratioX;
      rawRatioY.value = info.ratioY;
      const computed = customScale.value;
      return computed;
    },
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

const setCustomScale = (val: number) => {
  customScale.value = val;
  if (adaptor) {
    adaptor.update({ customFit: (info) => val });
    scale.value = adaptor.scale;
  }
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <h1>CustomFit 自定义缩放</h1>
      <p>通过 customFit 函数完全控制缩放比例，下方按钮切换不同的自定义策略</p>
      <div class="modes">
        <button :class="{ active: customScale === 0.5 }" @click="setCustomScale(0.5)">固定 0.5x</button>
        <button :class="{ active: customScale === 0.8 }" @click="setCustomScale(0.8)">固定 0.8x</button>
        <button :class="{ active: customScale === 1.0 }" @click="setCustomScale(1.0)">固定 1.0x</button>
        <button :class="{ active: customScale === 1.5 }" @click="setCustomScale(1.5)">固定 1.5x</button>
      </div>
      <div class="info-row">
        <div class="info-box">
          <span class="label">原始 ratioX</span>
          <span class="val">{{ rawRatioX.toFixed(4) }}</span>
        </div>
        <div class="info-box">
          <span class="label">原始 ratioY</span>
          <span class="val">{{ rawRatioY.toFixed(4) }}</span>
        </div>
        <div class="info-box highlight">
          <span class="label">customFit 返回值</span>
          <span class="val">{{ customScale.toFixed(2) }}</span>
        </div>
        <div class="info-box highlight">
          <span class="label">实际 scale</span>
          <span class="val">{{ scale.toFixed(4) }}</span>
        </div>
      </div>
      <div class="indicator">
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: Math.min(scale * 100, 100) + '%' }"></div>
        </div>
        <span class="bar-label">{{ (scale * 100).toFixed(1) }}%</span>
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
.info-row { display: flex; gap: 16px; justify-content: center; margin-bottom: 24px; }
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
.info-box.highlight {
  background: rgba(0, 88, 255, 0.15);
  border-color: rgba(0, 88, 255, 0.35);
}
.label { font-size: 11px; color: #666; text-transform: uppercase; }
.val { font-size: 18px; color: #41d1ff; font-weight: 600; font-variant-numeric: tabular-nums; }
.indicator {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}
.bar-track {
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0058ff, #41d1ff);
  border-radius: 4px;
  transition: width 0.3s;
}
.bar-label {
  font-size: 14px;
  color: #41d1ff;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  min-width: 60px;
}
</style>
