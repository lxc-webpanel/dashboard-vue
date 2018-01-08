<template>
  <div class="loader">
    <v-progress-circular size="24" indeterminate class="secondary--text"></v-progress-circular>
  </div>
</template>

<script>
  export default {
    name: 'loader'
  };
</script>

<style lang="scss">
  .loader {
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
