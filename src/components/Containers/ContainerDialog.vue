<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" lazy width="420">
      <v-card v-if="active">
        <v-card-title :class="classnames.backgroundColor" style="height: 80px;">
          <span class="subheading" :class="classnames.textColor">{{ container.name }}</span>
          <v-spacer></v-spacer>
          <container-menu :id="id"></container-menu>
        </v-card-title>
        <v-list two-line style="max-height: 300px; overflow-y: auto;">
          <v-subheader v-if="ips.length > 0" inset v-text="$t('stats.network')"></v-subheader>
          <v-list-item v-for="(ip, i) in ips" :key="ip">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="dark-grey--text" v-if="i === 0">settings_ethernet</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="ip"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
          <v-divider v-if="ips.length > 0" inset></v-divider>
          <v-subheader v-if="cpus.raw" inset v-text="$tc('stats.cpu', cpus.raw.length)"></v-subheader>
          <v-list-item v-if="cpus.raw">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="dark-grey--text">data_usage</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ $tc('stats.cpu', cpus.raw.length) }} {{ cpus.formatted }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
          <v-divider v-if="cpus.raw" inset></v-divider>
          <v-subheader v-if="memoryLimit.raw.length > 0 || memorySwapLimit.raw.length > 0" inset v-text="$t('stats.memory')"></v-subheader>
          <v-list-item v-if="memoryLimit.raw.length > 0">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="dark-grey--text">memory</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="$t('stats.memory_limit')"></v-list-tile-title>
                <v-list-tile-sub-title>{{ memoryLimit.formatted }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
          <v-list-item v-if="memorySwapLimit.raw.length > 0">
            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="$t('stats.swap_limit')"></v-list-tile-title>
                <v-list-tile-sub-title>{{ memorySwapLimit.formatted }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
          <v-divider inset v-if="memoryLimit.raw.length > 0 || memorySwapLimit.raw.length > 0"></v-divider>
          <v-subheader v-if="rootfs" inset v-text="$t('stats.file_system')"></v-subheader>
          <v-list-item v-if="rootfs">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="dark-grey--text">storage</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>RootFS</v-list-tile-title>
                <v-list-tile-sub-title v-text="rootfs"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import ContainerMenu from './ContainerMenu';
  import { getStateStatusColorsClassnames } from '../../libraries/utils/colors';

  export default {
    // props: ['value'],
    components: {
      'container-menu': ContainerMenu
    },
    computed: {
      active: {
        get() {
          return this.$store.state.containers.dialogs.info !== null;
          // return this.value;
        },
        set(value) {
          if (!value) {
            this.$store.dispatch('closeContainerInfoDialog');
          }
          // this.$emit('input', value);
        }
      },
      container() {
        return this.$store.getters.containerData(this.id);
      },
      id() {
        return this.$store.state.containers.dialogs.info;
      },
      state() {
        return this.container.state;
      },
      ips() {
        return this.container.ips;
      },
      rootfs() {
        return this.container.rootfs;
      },
      cpus() {
        return this.container.cpus;
      },
      memorySwapLimit() {
        return this.container.memory.swap;
      },
      memoryLimit() {
        return this.container.memory.limit;
      },
      classnames() {
        return getStateStatusColorsClassnames(this.container.state);
      }
    }
  };
</script>
