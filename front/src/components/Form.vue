<template>
  <div class="textarea_container">
    <textarea 
      v-model="pasted" 
      class="textarea" 
      placeholder="Paste numbers here..."
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
</script>

<style lang="scss" scoped>
.textarea_container {
  margin-right: 20px;
}

.textarea {
  display: block;
  height: 230px;
  width: 350px;
  padding: 5px;
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
