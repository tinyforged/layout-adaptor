<script setup lang="ts">
import { LayoutAdaptor, type Direction } from "layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

const scale = ref(1);
const direction = ref<Direction>("both");
let adaptor: LayoutAdaptor | null = null;

const directions: { value: Direction; label: string }[] = [
  { value: "horizontal", label: "水平" },
  { value: "vertical", label: "垂直" },
  { value: "both", label: "双向" },
];

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
  adaptor.on("directionChange", (dir) => {
    direction.value = dir;
  });
  adaptor.start();
  scale.value = adaptor.scale;
});

onUnmounted(() => {
  adaptor?.stop();
});

const setDirection = (dir: Direction) => {
  adaptor?.setDirection(dir);
};
</script>

<template>
  <div id="demo-area" class="area">
    <div class="content">
      <div class="panel">
        <div class="label">当前缩放: {{ scale.toFixed(4) }}</div>
        <div class="label">方向: {{ direction }}</div>
      </div>

      <div class="row">
        <div v-for="item in directions" :key="item.value" class="panel">
          <button
            class="dir-btn"
            :class="{ active: direction === item.value }"
            @click="setDirection(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="panel">
        <div class="label">说明</div>
        <div class="desc">
          <p><strong>horizontal</strong>: 仅水平方向缩放</p>
          <p><strong>vertical</strong>: 仅垂直方向缩放</p>
          <p><strong>both</strong>: 双向等比缩放</p>
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
.dir-btn {
  padding: 10px 24px;
  border-radius: 6px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}
.dir-btn.active {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.6);
}
.dir-btn:not(.active):hover {
  background: rgba(34, 197, 94, 0.2);
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
