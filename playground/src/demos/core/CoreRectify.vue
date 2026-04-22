<script setup lang="ts">
import { LayoutAdaptor } from "@tinyforged/layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const rectified = ref(false);
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

const toggleRectify = () => {
  if (!adaptor || rectified.value) return;
  adaptor.inverseScale("#rectify-target", 1);
  rectified.value = true;
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <div class="row">
        <div class="panel">
          <div class="label">缩放中的元素</div>
          <div class="box normal-box">我随画布缩放 scale={{ scale.toFixed(2) }}</div>
        </div>
        <div class="panel">
          <div class="label">rectify 修正元素</div>
          <div id="rectify-target" class="box" data-la-rectify>
            {{ rectified ? "已修正 — 视觉尺寸保持原始" : "点击按钮修正我" }}
          </div>
        </div>
      </div>
      <button class="action" @click="toggleRectify" :disabled="rectified">
        {{ rectified ? "已修正" : "adaptor.inverseScale('.rectify-target', 1)" }}
      </button>
      <p class="hint">修正后，即使画布缩放了，该元素在视觉上会保持原始尺寸</p>
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
.row { display: flex; gap: 60px; margin-bottom: 40px; }
.panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 40px;
  min-width: 500px;
}
.label {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.box { padding: 24px; border-radius: 10px; font-size: 16px; color: #ccc; }
.normal-box { background: rgba(0, 88, 255, 0.08); border: 1px solid rgba(0, 88, 255, 0.2); }
#rectify-target {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  width: 400px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

 data-la-rectify
.action {
  padding: 12px 32px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  cursor: pointer;
  font-size: 14px;
  font-family: monospace;
}
.action:disabled { opacity: 0.5; cursor: default; }
.action:not(:disabled):hover { background: rgba(239, 68, 68, 0.2); }
.hint { margin-top: 20px; font-size: 14px; color: #555; }
</style>
