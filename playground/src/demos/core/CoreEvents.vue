<script setup lang="ts">
import { LayoutAdaptor, type LayoutAdaptorEventType } from "layout-adaptor";
import { onMounted, onUnmounted, ref } from "vue";

interface LogEntry {
  id: number;
  time: string;
  event: string;
  detail: string;
}

const scale = ref(1);
const logId = ref(0);
const logs = ref<LogEntry[]>([]);
const enabledEvents = ref<Set<LayoutAdaptorEventType>>(
  new Set(["scaleChange", "resize", "render"]),
);
let adaptor: LayoutAdaptor | null = null;

const allEvents: LayoutAdaptorEventType[] = [
  "scaleChange",
  "resize",
  "render",
  "start",
  "stop",
];

const now = () => {
  const d = new Date();
  return `${d.getMinutes().toString().padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`;
};

const addLog = (event: string, detail: string) => {
  logs.value.unshift({ id: ++logId.value, time: now(), event, detail });
  if (logs.value.length > 50) logs.value.length = 50;
};

const toggleEvent = (evt: LayoutAdaptorEventType) => {
  if (enabledEvents.value.has(evt)) {
    enabledEvents.value.delete(evt);
  } else {
    enabledEvents.value.add(evt);
  }
};

const clearLogs = () => {
  logs.value = [];
  logId.value = 0;
};

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

  adaptor
    .on("scaleChange", (s) => {
      if (enabledEvents.value.has("scaleChange")) {
        addLog("scaleChange", `scale = ${s.toFixed(4)}`);
      }
    })
    .on("resize", (entry) => {
      if (enabledEvents.value.has("resize")) {
        addLog("resize", `${entry.viewportW} × ${entry.viewportH}`);
      }
    })
    .on("render", (state) => {
      if (enabledEvents.value.has("render")) {
        addLog(
          "render",
          `scale=${state.scale.toFixed(4)} tx=${state.translateX.toFixed(
            0,
          )} ty=${state.translateY.toFixed(0)}`,
        );
      }
    })
    .on("start", () => {
      if (enabledEvents.value.has("start")) {
        addLog("start", "adaptor started");
      }
    })
    .on("stop", () => {
      if (enabledEvents.value.has("stop")) {
        addLog("stop", "adaptor stopped");
      }
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
      <h1>Event System 事件系统</h1>
      <p>拖动窗口触发事件，实时查看事件日志。可勾选/取消监听的事件类型</p>
      <div class="controls">
        <div class="scale-info">
          <span class="label">当前 scale</span>
          <span class="val">{{ scale.toFixed(4) }}</span>
        </div>
        <div class="event-toggles">
          <label
            v-for="evt in allEvents"
            :key="evt"
            class="toggle"
            :class="{ on: enabledEvents.has(evt) }"
          >
            <input
              type="checkbox"
              :checked="enabledEvents.has(evt)"
              @change="toggleEvent(evt)"
            />
            {{ evt }}
          </label>
        </div>
        <button class="clear-btn" @click="clearLogs">清除日志</button>
      </div>
      <div class="log-panel">
        <div class="log-header">
          <span>时间</span>
          <span>事件</span>
          <span>详情</span>
        </div>
        <div class="log-list">
          <div
            v-for="entry in logs.slice(0, 20)"
            :key="entry.id"
            class="log-row"
          >
            <span class="log-time">{{ entry.time }}</span>
            <span class="log-event" :class="'evt-' + entry.event">{{
              entry.event
            }}</span>
            <span class="log-detail">{{ entry.detail }}</span>
          </div>
          <div v-if="logs.length === 0" class="log-empty">
            拖动窗口以触发事件...
          </div>
        </div>
        <div class="log-count">共 {{ logs.length }} 条日志</div>
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
  width: 900px;
}
h1 {
  font-size: 48px;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}
p {
  font-size: 18px;
  color: #888;
  margin-bottom: 24px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  margin-bottom: 24px;
}
.scale-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 16px;
  background: rgba(0, 88, 255, 0.12);
  border: 1px solid rgba(0, 88, 255, 0.25);
  border-radius: 8px;
}
.label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}
.val {
  font-size: 16px;
  color: #41d1ff;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.event-toggles {
  display: flex;
  gap: 8px;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-family: monospace;
}
.toggle input {
  display: none;
}
.toggle.on {
  background: rgba(0, 88, 255, 0.15);
  border-color: rgba(0, 88, 255, 0.35);
  color: #60a5fa;
}
.clear-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #888;
  cursor: pointer;
  font-size: 12px;
}
.clear-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.log-panel {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
}
.log-header {
  display: grid;
  grid-template-columns: 100px 120px 1fr;
  gap: 12px;
  padding: 10px 16px;
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.log-list {
  max-height: 320px;
  overflow-y: auto;
}
.log-row {
  display: grid;
  grid-template-columns: 100px 120px 1fr;
  gap: 12px;
  padding: 6px 16px;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}
.log-time {
  color: #555;
  font-family: monospace;
  font-variant-numeric: tabular-nums;
}
.log-event {
  font-family: monospace;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
  text-align: left;
}
.evt-scaleChange {
  color: #41d1ff;
  background: rgba(65, 209, 255, 0.08);
}
.evt-resize {
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
}
.evt-render {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.08);
}
.evt-start {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
}
.evt-stop {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
}
.log-detail {
  color: #888;
  text-align: left;
  font-variant-numeric: tabular-nums;
}
.log-empty {
  padding: 40px;
  color: #444;
  font-size: 14px;
}
.log-count {
  padding: 8px 16px;
  font-size: 11px;
  color: #444;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
