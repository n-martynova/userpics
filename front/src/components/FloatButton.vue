<template>
  <button
    class="btn export-btn"
    @click="$emit('export')"
  />
</template>
  
  <style lang="scss" scoped>
  .export-btn {
    position: sticky;
    bottom: 20px;
    margin-left: 10px;
    width: 60px;
    height: 60px;
    background-image: url('../assets/tg.svg');
    border-radius: 50%;
    background-size: contain;
    background-color: #f6daf5;
    border: none;

    &:active {
      background-color: #f3b2f1;
    }
  }
  </style>
  
