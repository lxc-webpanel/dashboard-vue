<template>
  <v-flex xl3 lg4 md6 sm12 xs12 class="mb-3">
    <v-card :class="classnames.backgroundColor">
      <v-card-title style="height: 80px;">
        <span class="subheading" :class="classnames.textColor">{{ container.name }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="$store.dispatch('openContainerInfoDialog', id)">
          <v-icon :class="classnames.textColor">info_outline</v-icon>
        </v-btn>
        <container-menu :id="id"></container-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <div>
          <v-chip label outline :class="classnames.labelColor"><v-icon left>power_settings_new</v-icon>{{ $tc(`containers.states.${state}`) }}</v-chip>

          <v-chip label outline :class="classnames.labelColor"><v-icon left>code</v-icon>LXC</v-chip>

          <v-chip v-for="group in container.groups" :key="group" label outline :class="classnames.labelColor"><v-icon left>group_work</v-icon><span>{{ group }}</span></v-chip>
        </div>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
  import ContainerMenu from './ContainerMenu';
  import { getStateStatusColorsClassnames } from '../../libraries/utils/colors';

  export default {
    props: ['id'],
    components: {
      'container-menu': ContainerMenu
    },
    data() {
      return {
        dialog: false
      };
    },
    computed: {
      container() {
        return this.$store.getters.containerData(this.id);
      },
      state() {
        return this.container.state;
      },
      loading() {
        return this.$store.getters.containerIsLoading(this.id);
      },
      classnames() {
        return getStateStatusColorsClassnames(this.state);
      }
    }
  };
</script>

<style lang="scss">
  .state--transitioning {
    opacity: .8;
    transition: opacity .2s;
  }
</style>
