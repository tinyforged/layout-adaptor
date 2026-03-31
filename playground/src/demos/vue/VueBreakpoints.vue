<script setup lang="ts">
import { LayoutAdaptor } from "layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
let adaptor: LayoutAdaptor | null = null;

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    direction: "both",
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
      <div class="panel">
        <div class="label">当前缩放: {{ scale.toFixed(4) }}</div>
      </div>
      <div class="row">
        <div class="panel">
          <div class="label">水平</div>
          <div class="box h-box">宽度随视口变化</div>
        </div>
        <div class="panel">
          <div class="label">垂直</div>
          <div class="box v-box">高度随视口变化</div>
        </div>
      </div>
      <p class="hint">
        horizontal: 仅水平缩放, vertical: 仅垂直缩放, both: 双向缩放
      </p>
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
  gap: 60px;
  margin-bottom: 30px;
}
.panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
}
.label {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}
.h-box {
  padding: 20px;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #4ade80;
}
.v-box {
  padding: 20px;
  border-radius: 8px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
  color: #c084fc;
}
.hint {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}
</style>
