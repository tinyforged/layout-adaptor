<script setup lang="ts">
import { LayoutAdaptor, type AdaptMode } from "layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const adaptMode = ref<AdaptMode>("scale");
let adaptor: LayoutAdaptor | null = null;

const modes: AdaptMode[] = ["scale", "rem", "vwvh", "zoom"];

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    adaptMode: adaptMode.value,
    resize: true,
    onScaleChange: (s) => {
      scale.value = s;
    },
  });
  adaptor.on("adaptModeChange", (mode) => {
    adaptMode.value = mode;
  });
  adaptor.start();
  scale.value = adaptor.scale;
});

onUnmounted(() => {
  adaptor?.stop();
  adaptor = null;
});

const setMode = (mode: AdaptMode) => {
  adaptor?.setAdaptMode(mode);
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <div class="panel">
        <div class="label">当前缩放: {{ scale.toFixed(4) }}</div>
        <div class="label">适配模式: {{ adaptMode }}</div>
      </div>
      <div class="row">
        <button
          v-for="m in modes"
          :key="m"
          class="mode-btn"
          :class="{ active: adaptMode === m }"
          @click="setMode(m)"
        >
          {{ m }}
        </button>
      </div>
      <div class="panel">
        <div class="label">说明</div>
        <div class="desc">
          <p><strong>scale</strong>: transform: scale() 默认方式</p>
          <p><strong>rem</strong>: 动态修改 html font-size</p>
          <p><strong>vwvh</strong>: CSS vw/vh 单位</p>
          <p><strong>zoom</strong>: CSS zoom 属性</p>
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
.content {
  text-align: center;
}
.row {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}
.panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px 30px;
}
.label {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}
.mode-btn {
  padding: 10px 24px;
  border-radius: 6px;
  border: 1px solid rgba(0, 120, 255, 0.3);
  background: rgba(0, 120, 255, 0.1);
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}
.mode-btn.active {
  background: rgba(0, 120, 255, 0.3);
  border-color: rgba(0, 120, 255, 0.6);
}
.mode-btn:not(.active):hover {
  background: rgba(0, 120, 255, 0.2);
}
.desc {
  text-align: left;
  font-size: 13px;
  color: #aaa;
  line-height: 1.8;
}
.desc p {
  margin: 4px 0;
}
</style>
