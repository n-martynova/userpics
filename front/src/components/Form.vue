<template>
  <div class="textarea_container">
    <textarea 
      v-model="pasted" 
      class="textarea" 
      placeholder="Paste numbers here (7XXXXXXXXXX, linebreaks are allowed)..."
      @keydown.enter.prevent="$emit('submit', pasted)" 
    />
    <div
      class="btn submit-btn"
      @click="$emit('submit', pasted)"
    >
      Submit!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const pasted = ref('');

defineEmits(['submit']);
</script>

<style lang="scss" scoped>
.textarea_container {
  margin-right: 20px;

  @media screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-right: 0;
  }
}

.textarea {
  display: block;
  height: 230px;
  width: 350px;
  padding: 5px;
  margin-bottom: 10px;
  font-size: 16px;

  @media screen and (max-width: 767px) {
    width: auto;
    margin-bottom: 20px;
  }
}
</style>
