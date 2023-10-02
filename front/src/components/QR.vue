<template>
  <div class="qr-container">
    <canvas 
      ref="canvas" 
      class="canvas"
    />
  </div>
</template>

<script setup>
import QRCode from 'qrcode';
import { nextTick, onMounted, ref } from 'vue';

const canvas = ref(null);

const props = defineProps({
  qr: {
    type: Object,
    required: true,
  },
});

onMounted(async () => {
  await nextTick();
  QRCode.toCanvas(canvas.value, props.qr, function (error) {
    if (error) console.error(error);
  })
})
</script>

<style lang="scss" scoped>
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 280px;
  position: relative;
  border: 1px dashed #a4a2a2;
}
</style>
