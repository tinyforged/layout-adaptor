<script setup lang="ts">
import { LayoutAdaptor, type OverflowMode } from "@tinyforged/layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const currentOverflow = ref<OverflowMode>("hidden");
let adaptor: LayoutAdaptor | null = null;

const modes: OverflowMode[] = ["hidden", "visible", "auto"];

const modeDescriptions: Record<OverflowMode, string> = {
  hidden: "裁切溢出内容，只显示视口范围内的内容",
  visible: "溢出内容可见，不裁切",
  auto: "浏览器默认行为，内容超出时显示滚动条",
};

const switchMode = (mode: OverflowMode) => {
  currentOverflow.value = mode;
  if (adaptor) {
    adaptor.update({ overflow: mode });
    scale.value = adaptor.scale;
  }
};

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    fitMode: "crop",
    alignX: "center",
    alignY: "center",
    overflow: "hidden",
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
      <h1>Overflow 溢出控制</h1>
      <p>使用 crop 模式 + 不同 overflow 值，观察溢出内容的处理差异</p>
      <div class="modes">
        <button
          v-for="m in modes"
          :key="m"
          :class="{ active: currentOverflow === m }"
          @click="switchMode(m)"
        >
          overflow: {{ m }}
        </button>
      </div>
      <div class="info-row">
        <div class="info-box">
          <span class="label">当前 overflow</span>
          <span class="val">{{ currentOverflow }}</span>
        </div>
        <div class="info-box">
          <span class="label">fitMode</span>
          <span class="val">crop</span>
        </div>
        <div class="info-box highlight">
          <span class="label">scale</span>
          <span class="val">{{ scale.toFixed(4) }}</span>
        </div>
        <div class="info-box desc-box">
          <span class="label">说明</span>
          <span class="val desc">{{ modeDescriptions[currentOverflow] }}</span>
        </div>
      </div>
      <div class="visual-hint">
        <div class="viewport-frame">
          <div class="design-frame" :style="{ transform: `scale(${scale})`, transformOrigin: 'center' }">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div class="viewport-label">视口边界</div>
        </div>
        <div class="hint-text">
          <span v-if="currentOverflow === 'hidden'" class="tag hidden-tag">超出部分被裁切 ✓</span>
          <span v-else-if="currentOverflow === 'visible'" class="tag visible-tag">超出部分可见 ✓</span>
          <span v-else class="tag auto-tag">超出时出现滚动条 ✓</span>
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
.desc-box { max-width: 320px; }
.label { font-size: 11px; color: #666; text-transform: uppercase; }
.val { font-size: 18px; color: #41d1ff; font-weight: 600; font-variant-numeric: tabular-nums; }
.val.desc { font-size: 14px; font-weight: 400; color: #aaa; }

.visual-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.viewport-frame {
  width: 300px;
  height: 170px;
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.design-frame {
  width: 240px;
  height: 135px;
  border: 2px solid rgba(0, 88, 255, 0.5);
  border-radius: 4px;
  position: relative;
  transition: transform 0.3s;
}
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: #41d1ff;
  border-style: solid;
}
.corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
.viewport-label {
  position: absolute;
  bottom: -20px;
  font-size: 11px;
  color: #555;
}
.hint-text { margin-top: 8px; }
.tag {
  font-size: 14px;
  padding: 4px 14px;
  border-radius: 6px;
  font-weight: 600;
}
.hidden-tag { color: #41d1ff; background: rgba(65, 209, 255, 0.1); }
.visible-tag { color: #34d399; background: rgba(52, 211, 153, 0.1); }
.auto-tag { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
</style>
