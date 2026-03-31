<script setup lang="ts">
import { useLayoutAdaptor } from "layout-adaptor-vue";
import { ref, computed } from "vue";

const currentW = ref(1920);
const currentH = ref(1080);

const { scale, update } = useLayoutAdaptor({
  target: "#demo-area",
  designWidth: 1920,
  designHeight: 1080,
  resize: true,
});

const presets = [
  { w: 1920, h: 1080, label: "1920×1080" },
  { w: 1280, h: 720, label: "1280×720" },
  { w: 3840, h: 2160, label: "3840×2160" },
  { w: 1366, h: 768, label: "1366×768" },
];

const activePreset = ref("1920×1080");

const applyPreset = (w: number, h: number, label: string) => {
  activePreset.value = label;
  currentW.value = w;
  currentH.value = h;
  update({ designWidth: w, designHeight: h });
};

const areaStyle = computed(() => ({
  width: currentW.value + "px",
  height: currentH.value + "px",
}));
</script>

<template>
  <div id="demo-area" class="area" :style="areaStyle">
    <div class="center-box">
      <h1>update()</h1>
      <p>运行时动态切换设计稿尺寸，无需销毁重建</p>
      <div class="presets">
        <button
          v-for="p in presets"
          :key="p.label"
          :class="{ active: activePreset === p.label }"
          @click="applyPreset(p.w, p.h, p.label)"
        >
          {{ p.label }}
        </button>
      </div>
      <div class="info-row">
        <div class="info-box">
          <span class="label">设计稿</span>
          <span class="val">{{ currentW }} × {{ currentH }}</span>
        </div>
        <div class="info-box highlight">
          <span class="label">scale</span>
          <span class="val">{{ scale.toFixed(4) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.area {
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
.presets { display: flex; gap: 12px; justify-content: center; margin-bottom: 24px; }
.presets button {
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.presets button:hover { background: rgba(0, 88, 255, 0.1); color: #fff; }
.presets button.active {
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
}
.info-box.highlight {
  background: rgba(0, 88, 255, 0.15);
  border-color: rgba(0, 88, 255, 0.35);
}
.label { font-size: 11px; color: #666; text-transform: uppercase; }
.val { font-size: 18px; color: #41d1ff; font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
