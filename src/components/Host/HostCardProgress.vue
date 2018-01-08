<template>
  <v-progress-linear class="host-card-progress" :class="statusClassName" v-model="value" height="5"></v-progress-linear>
</template>

<script>
  import { getResourcesStatusColorClassName } from '../../libraries/utils/colors';

  export default {
    props: ['value'],
    computed: {
      statusClassName() {
        return getResourcesStatusColorClassName(this.value, 'extraLight');
      }
    }
  };
</script>

<style lang="scss">
  .host-card-progress {
    position: absolute;
    bottom: 0;
    left: 0,;
    height: 5px;
    width: 100%;
    margin: 0;

    .progress-linear__bar {
      background-color: transparent;
    }

    .progress-linear__bar__determinate {
      background-color: white;
    }
  }
</style>
