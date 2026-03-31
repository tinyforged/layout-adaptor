<script setup lang="ts">
import { LayoutAdaptor } from "layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const disabled = ref(false);
let adaptor: LayoutAdaptor | null = null;

onMounted(() => {
  adaptor = new LayoutAdaptor({
    target: "#demo-area",
    designWidth: 1920,
    designHeight: 1080,
    disabled: false,
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

const toggleDisabled = () => {
  if (disabled.value) {
    adaptor?.enable();
    disabled.value = false;
  } else {
    adaptor?.disable();
    disabled.value = true;
  }
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <div class="panel">
        <div class="label">当前缩放: {{ scale.toFixed(4) }}</div>
        <div class="label">状态: {{ disabled ? "已禁用" : "已启用" }}</div>
      </div>

      <button
        class="toggle-btn"
        :class="{ disabled }"
        @click="toggleDisabled"
      >
        {{ disabled ? "启用适配" : "禁用适配" }}
      </button>

      <div class="panel">
        <div class="label">说明</div>
        <div class="desc">
          <p><strong>enable()</strong>: 重新启用适配器</p>
          <p><strong>disable()</strong>: 禁用适配器，保留实例</p>
          <p>禁用后会清除所有内联样式，恢复原始状态</p>
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
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}
.toggle-btn.disabled {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
}
.toggle-btn:hover {
  opacity: 0.8;
}
.desc {
  text-align: left;
  font-size: 13px;
  color: #aaa;
  line-height: 1.6;
}
.desc p {
  margin: 4px 0;
}
</style>
