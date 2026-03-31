<script setup lang="ts">
import { LayoutAdaptor } from "layout-adaptor";
import { onMounted, onUnmounted, ref, computed } from "vue";

const scale = ref(1);
const clamped = ref(false);
const rawScale = ref(1);
let adaptor: LayoutAdaptor | null = null;

const presets = [
  { label: "min: 0.5 / max: 1.5", min: 0.5, max: 1.5 },
  { label: "min: 0.3 / max: 2.0", min: 0.3, max: 2.0 },
  { label: "min: 0.8 / max: 1.2", min: 0.8, max: 1.2 },
  { label: "无限制", min: 0, max: Infinity },
];

const currentPreset = ref(0);

const activeMin = computed(() => presets[currentPreset.value].min);
const activeMax = computed(() => presets[currentPreset.value].max);

const scaleStatus = computed(() => {
  if (scale.value >= activeMax.value && activeMax.value !== Infinity) return "已达上限";
  if (scale.value <= activeMin.value) return "已达下限";
  return "范围内";
});

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    resize: true,
    minScale: presets[0].min,
    maxScale: presets[0].max,
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

const switchPreset = (idx: number) => {
  currentPreset.value = idx;
  const p = presets[idx];
  adaptor?.update({ minScale: p.min, maxScale: p.max });
  if (adaptor) {
    rawScale.value = scale.value;
    scale.value = adaptor.scale;
    clamped.value = rawScale.value !== scale.value;
  }
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <h1>Scale Limits 缩放范围</h1>
      <p>拖动窗口大小，观察 scale 如何被 clamp 到 [minScale, maxScale] 范围内</p>
      <div class="modes">
        <button
          v-for="(p, i) in presets"
          :key="i"
          :class="{ active: currentPreset === i }"
          @click="switchPreset(i)"
        >
          {{ p.label }}
        </button>
      </div>
      <div class="info-row">
        <div class="info-box">
          <span class="label">minScale</span>
          <span class="val">{{ activeMin === 0 ? "0" : activeMin.toFixed(1) }}</span>
        </div>
        <div class="info-box">
          <span class="label">maxScale</span>
          <span class="val">{{ activeMax === Infinity ? "∞" : activeMax.toFixed(1) }}</span>
        </div>
        <div class="info-box highlight">
          <span class="label">当前 scale</span>
          <span class="val">{{ scale.toFixed(4) }}</span>
        </div>
        <div class="info-box" :class="{ warn: clamped }">
          <span class="label">状态</span>
          <span class="val">{{ scaleStatus }}</span>
        </div>
      </div>
      <div class="ruler">
        <div class="ruler-track">
          <div
            class="ruler-range"
            :style="{
              left: (activeMin / 2 * 100) + '%',
              width: ((activeMax === Infinity ? 2 : activeMax) / 2 * 100 - activeMin / 2 * 100) + '%',
            }"
          ></div>
          <div
            class="ruler-marker"
            :style="{ left: Math.min(scale / 2 * 100, 100) + '%' }"
          ></div>
        </div>
        <div class="ruler-labels">
          <span>0</span>
          <span>0.5</span>
          <span>1.0</span>
          <span>1.5</span>
          <span>2.0</span>
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
.info-row { display: flex; gap: 16px; justify-content: center; margin-bottom: 32px; }
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
.info-box.warn {
  background: rgba(255, 160, 0, 0.12);
  border-color: rgba(255, 160, 0, 0.3);
}
.info-box.warn .val { color: #ffa000; }
.label { font-size: 11px; color: #666; text-transform: uppercase; }
.val { font-size: 18px; color: #41d1ff; font-weight: 600; font-variant-numeric: tabular-nums; }
.ruler { max-width: 500px; margin: 0 auto; }
.ruler-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  position: relative;
}
.ruler-range {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(0, 88, 255, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(0, 88, 255, 0.3);
}
.ruler-marker {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 20px;
  background: #41d1ff;
  border-radius: 2px;
  transform: translateX(-50%);
  transition: left 0.3s;
}
.ruler-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 11px;
  color: #555;
}
</style>
