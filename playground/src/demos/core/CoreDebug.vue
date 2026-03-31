<script setup lang="ts">
import { LayoutAdaptor } from "layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const debugEnabled = ref(true);
let adaptor: LayoutAdaptor | null = null;

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    debug: {
      enabled: true,
      color: "rgba(0, 120, 255, 0.85)",
      position: "top-right",
    },
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

const toggleDebug = () => {
  debugEnabled.value = !debugEnabled.value;
  adaptor?.update({ debug: debugEnabled.value });
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <div class="panel">
        <div class="label">当前缩放: {{ scale.toFixed(4) }}</div>
        <div class="label">调试面板: {{ debugEnabled ? "开启" : "关闭" }}</div>
      </div>

      <button class="toggle-btn" @click="toggleDebug">
        {{ debugEnabled ? "关闭调试面板" : "开启调试面板" }}
      </button>

      <div class="panel">
        <div class="label">说明</div>
        <div class="desc">
          <p>调试面板显示实时状态信息：</p>
          <p>• scale: 当前缩放比例</p>
          <p>• viewport: 视口尺寸</p>
          <p>• design: 设计稿尺寸</p>
          <p>• mode: 适配模式</p>
          <p>• dir: 缩放方向</p>
          <p>• fit: fitMode</p>
          <p>• dpr: 设备像素比</p>
          <p>• translate: 位移值</p>
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
.panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
}
.label {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}
.toggle-btn {
  padding: 12px 32px;
  border-radius: 8px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  background: rgba(168, 85, 247, 0.1);
  color: #c084fc;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}
.toggle-btn:hover {
  background: rgba(168, 85, 247, 0.2);
}
.desc {
  text-align: left;
  font-size: 13px;
  color: #aaa;
  line-height: 1.6;
}
.desc p {
  margin: 3px 0;
}
</style>
