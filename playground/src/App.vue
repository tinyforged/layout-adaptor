<script setup lang="ts">
import { ref, type Component } from "vue";
import { coreDemos, vueDemos, type DemoMeta } from "./demos";
import CoreBasic from "./demos/core/CoreBasic.vue";
import CoreFitMode from "./demos/core/CoreFitMode.vue";
import CoreIgnore from "./demos/core/CoreIgnore.vue";
import CoreRectify from "./demos/core/CoreRectify.vue";
import CoreTransition from "./demos/core/CoreTransition.vue";
import CoreCustomFit from "./demos/core/CoreCustomFit.vue";
import CoreScaleLimits from "./demos/core/CoreScaleLimits.vue";
import CoreEvents from "./demos/core/CoreEvents.vue";
import CoreOverflow from "./demos/core/CoreOverflow.vue";
import CoreAdaptMode from "./demos/core/CoreAdaptMode.vue";
import CoreDirection from "./demos/core/CoreDirection.vue";
import CoreBreakpoints from "./demos/core/CoreBreakpoints.vue";
import CoreDebug from "./demos/core/CoreDebug.vue";
import CoreDisabled from "./demos/core/CoreDisabled.vue";
import VueComposable from "./demos/vue/VueComposable.vue";
import VueProvider from "./demos/vue/VueProvider.vue";
import VueSync from "./demos/vue/VueSync.vue";
import VueAdaptMode from "./demos/vue/VueAdaptMode.vue";
import VueBreakpoints from "./demos/vue/VueBreakpoints.vue";
import VueDirection from "./demos/vue/VueDirection.vue";
import VueDebug from "./demos/vue/VueDebug.vue";

type Tab = "core" | "vue";

const tab = ref<Tab>("core");
const currentDemo = ref<DemoMeta | null>(null);
const showSource = ref(false);

const demoComponents: Record<string, Component> = {
  "core-basic": CoreBasic,
  "core-fitmode": CoreFitMode,
  "core-ignore": CoreIgnore,
  "core-rectify": CoreRectify,
  "core-transition": CoreTransition,
  "core-customfit": CoreCustomFit,
  "core-scale-limits": CoreScaleLimits,
  "core-events": CoreEvents,
  "core-overflow": CoreOverflow,
  "core-adaptmode": CoreAdaptMode,
  "core-direction": CoreDirection,
  "core-breakpoints": CoreBreakpoints,
  "core-debug": CoreDebug,
  "core-disabled": CoreDisabled,
  "vue-composable": VueComposable,
  "vue-provider": VueProvider,
  "vue-sync": VueSync,
  "vue-adaptmode": VueAdaptMode,
  "vue-breakpoints": VueBreakpoints,
  "vue-direction": VueDirection,
  "vue-debug": VueDebug,
};

const demos = () => (tab.value === "core" ? coreDemos : vueDemos);

const openDemo = (demo: DemoMeta) => {
  currentDemo.value = demo;
  showSource.value = false;
};

const goBack = () => {
  currentDemo.value = null;
  showSource.value = false;
};
</script>

<template>
  <div v-if="currentDemo" class="demo-page">
    <div class="demo-toolbar">
      <button class="back-btn" @click="goBack">← 返回列表</button>
      <span class="demo-title">{{ currentDemo.title }}</span>
      <button
        class="source-btn"
        :class="{ on: showSource }"
        @click="showSource = !showSource"
      >
        {{ showSource ? "隐藏源码" : "查看源码" }}
      </button>
    </div>
    <div class="demo-body">
      <div class="demo-effect">
        <component :is="demoComponents[currentDemo.id]" />
      </div>
      <div v-if="showSource" class="demo-source">
        <div class="source-header">Source Code</div>
        <pre>{{ currentDemo.source }}</pre>
      </div>
    </div>
  </div>

  <div v-else class="home">
    <header class="hero">
      <div class="hero-inner">
        <h1>
          <span class="icon">◈</span>
          Layout Adaptor
          <span class="ver">v0.0.3</span>
        </h1>
        <p class="subtitle">
          响应式布局适配器 — 将任意容器等比缩放至设计稿尺寸
        </p>
        <div class="badges">
          <span class="badge core-badge">layout-adaptor</span>
          <span class="badge vue-badge">layout-adaptor-vue</span>
        </div>
      </div>
    </header>

    <nav class="tab-bar">
      <button :class="{ active: tab === 'core' }" @click="tab = 'core'">
        <span class="tab-dot core"></span>
        Core API
        <span class="tab-desc">layout-adaptor</span>
      </button>
      <button :class="{ active: tab === 'vue' }" @click="tab = 'vue'">
        <span class="tab-dot vue"></span>
        Vue 3
        <span class="tab-desc">layout-adaptor-vue</span>
      </button>
    </nav>

    <main class="demo-list">
      <div
        v-for="demo in demos()"
        :key="demo.id"
        class="demo-card"
        @click="openDemo(demo)"
      >
        <div class="card-header">
          <h3>{{ demo.title }}</h3>
          <span class="arrow">→</span>
        </div>
        <p class="card-desc">{{ demo.description }}</p>
        <pre class="card-preview">{{
          demo.source.split("\n").slice(0, 4).join("\n")
        }}</pre>
      </div>
    </main>

    <footer class="footer">
      <a href="https://github.com/tinyforged/layout-adaptor" target="_blank"
        >GitHub</a
      >
      <span>·</span>
      <a href="https://www.npmjs.com/package/layout-adaptor" target="_blank"
        >npm</a
      >
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
}
body {
  background: #08080f;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow-x: hidden;
}
a {
  color: #41d1ff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  overflow-y: auto;
}

.hero {
  width: 100%;
  padding: 60px 0 40px;
  text-align: center;
}
.hero-inner {
  max-width: 640px;
  margin: 0 auto;
}
h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.icon {
  font-size: 32px;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ver {
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 10px;
  border-radius: 4px;
  color: #666;
}
.subtitle {
  font-size: 16px;
  color: #888;
  margin-bottom: 20px;
  line-height: 1.6;
}
.badges {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.badge {
  font-size: 12px;
  padding: 4px 14px;
  border-radius: 6px;
  font-weight: 600;
}
.core-badge {
  background: rgba(0, 88, 255, 0.12);
  border: 1px solid rgba(0, 88, 255, 0.25);
  color: #60a5fa;
}
.vue-badge {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #34d399;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}
.tab-bar button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: #aaa;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}
.tab-bar button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.tab-bar button.active {
  background: rgba(0, 88, 255, 0.1);
  border-color: rgba(0, 88, 255, 0.3);
  color: #fff;
}
.tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.tab-dot.core {
  background: #3b82f6;
}
.tab-dot.vue {
  background: #10b981;
}
.tab-desc {
  font-size: 11px;
  font-weight: 400;
  color: #666;
}

.demo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  padding-bottom: 40px;
}
.demo-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}
.demo-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 88, 255, 0.2);
  transform: translateY(-2px);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card-header h3 {
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, #0058ff, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.arrow {
  font-size: 18px;
  color: #444;
  transition: color 0.2s;
}
.demo-card:hover .arrow {
  color: #41d1ff;
}
.card-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 12px;
}
.card-preview {
  font-size: 11px;
  color: #4a7a9b;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 10px 12px;
  line-height: 1.5;
  overflow: hidden;
  white-space: pre;
}

.footer {
  padding: 32px 0;
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
  color: #555;
}

.demo-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.demo-toolbar {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  background: rgba(8, 8, 15, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 100;
  flex-shrink: 0;
}
.back-btn {
  padding: 4px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 13px;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.demo-title {
  font-size: 14px;
  font-weight: 600;
  color: #ccc;
}
.source-btn {
  margin-left: auto;
  padding: 4px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 13px;
}
.source-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}
.source-btn.on {
  background: rgba(0, 88, 255, 0.15);
  border-color: rgba(0, 88, 255, 0.3);
  color: #60a5fa;
}
.demo-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.demo-effect {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.demo-source {
  width: 420px;
  background: #0c0c16;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  overflow-y: auto;
  flex-shrink: 0;
}
.source-header {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.demo-source pre {
  padding: 16px;
  font-size: 13px;
  color: #7dd3fc;
  line-height: 1.7;
  white-space: pre;
  font-family: "SF Mono", "Fira Code", monospace;
}
</style>
