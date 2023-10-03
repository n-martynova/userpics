<template>
  <div
    class="popup-mask"
    @click="$emit('close')"
    @click.right.prevent="$emit('close')"
  >
    <div class="popup-container">
      <div class="popup-body">
        <img :src="src" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
});

defineEmits(['close']);
</script>

<style>
.popup-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    transition: opacity 0.3s ease;
  }

  .popup-container {
    width: fit-content;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.2s ease;
  }
  
  .popup-enter-from, .popup-leave-to {
    opacity: 0;
  }
</style>  
