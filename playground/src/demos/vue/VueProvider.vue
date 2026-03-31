<script setup lang="ts">
import { LayoutAdaptorProvider } from "layout-adaptor-vue";
import { ref } from "vue";
import InnerContent from "./VueProviderInner.vue";

const lastScale = ref<number | null>(null);
const lastResize = ref<string | null>(null);
const started = ref(false);

const onScaleChange = (scale: number) => {
  lastScale.value = scale;
};

const onResize = (entry: { viewportW: number; viewportH: number }) => {
  lastResize.value = `${entry.viewportW} × ${entry.viewportH}`;
};

const onStart = () => {
  started.value = true;
};
</script>

<template>
  <div id="demo-area">
    <LayoutAdaptorProvider
      :design-width="1920"
      :design-height="1080"
      target="#demo-area"
      fit-mode="contain"
      :resize="true"
      @scale-change="onScaleChange"
      @resize="onResize"
      @start="onStart"
    >
      <InnerContent
        :last-scale="lastScale"
        :last-resize="lastResize"
        :started="started"
      />
    </LayoutAdaptorProvider>
  </div>
</template>

<style>
#demo-area {
  width: 1920px;
  height: 1080px;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
