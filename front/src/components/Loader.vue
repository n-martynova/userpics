<template>
  <h3 class="loading">
    Loading
  </h3>
</template>

<style lang="scss" scoped>
.loading {
  width: 200px;
  &::after {
    display: inline-block;
    animation: dotty steps(1,end) 1s infinite;
    content: '';
  }
}

@keyframes dotty {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
  100% { content: ''; }
}
</style>
