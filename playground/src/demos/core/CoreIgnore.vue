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
    resize: true,
    ignore: [
      { selector: ".ignore-el", fontSize: 16, scale: 1 },
      { selector: ".ignore-simple" },
    ],
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
    <div class="compare">
      <div class="panel scaled">
        <div class="label">跟随缩放</div>
        <div class="box">我跟随缩放 scale={{ scale.toFixed(2) }}</div>
        <div class="box">字体也会被缩放</div>
      </div>
      <div class="panel">
        <div class="label">ignore (对象配置)</div>
        <div class="box ignore-el">我忽略了缩放 (fontSize: 16px, scale: 1)</div>
      </div>
      <div class="panel">
        <div class="label">ignore (仅选择器)</div>
        <div class="box ignore-simple">我也忽略了缩放</div>
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
.compare { display: flex; gap: 40px; }
.panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 40px;
  min-width: 400px;
}
.panel.scaled { border-color: rgba(0, 88, 255, 0.25); }
.label {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.box {
  padding: 16px 20px;
  background: rgba(0, 88, 255, 0.08);
  border: 1px solid rgba(0, 88, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 15px;
  color: #ccc;
}
.ignore-el {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.25);
  color: #fbbf24;
}
.ignore-simple {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.25);
  color: #34d399;
}
</style>
