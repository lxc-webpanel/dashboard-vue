<template>
  <div>
    <loader v-if="loading"></loader>
    <v-menu id="space" bottom left origin="top right" transition="v-scale-transition" v-if="!loading">
      <v-btn icon="icon" slot="activator">
        <v-icon :class="classnames.textColor">more_vert</v-icon>
      </v-btn>
      <v-list>
        <template v-for="button in availableButtons">
          <v-divider v-if="button.divider && button.can !== false"></v-divider>
          <v-list-item v-if="button.can !== false" :key="button.name" @click.prevent="button.action(id)">
            <v-list-tile>
              <v-list-tile-title><v-icon>{{ button.icon }}</v-icon> {{ button.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { RUNNING, STOPPED, FROZEN } from '../../libraries/utils/states';
  import { getStateStatusColorsClassnames } from '../../libraries/utils/colors';
  import Loader from '../../components/Loader';

  export default {
    props: ['id'],
    components: {
      loader: Loader
    },
    data() {
      return {
        dialog: false,
        buttons: [
          {
            name: this.$t('containers.actions.start'),
            icon: 'play_arrow',
            action: this.startContainer,
            showWhen: [STOPPED]
          },
          {
            name: this.$t('containers.actions.freeze'),
            icon: 'pause_circle_filled',
            action: this.freezeContainer,
            showWhen: [RUNNING]
          },
          {
            name: this.$t('containers.actions.unfreeze'),
            icon: 'pause_circle_outline',
            action: this.unfreezeContainer,
            showWhen: [FROZEN]
          },
          {
            name: this.$t('containers.actions.stop'),
            icon: 'stop',
            action: this.stopContainer,
            showWhen: [RUNNING, FROZEN]
          },
          {
            name: this.$t('containers.actions.shutdown'),
            icon: 'power_settings_new',
            action: this.shutdownContainer,
            showWhen: [RUNNING, FROZEN]
          },
          {
            name: this.$t('containers.actions.restart'),
            icon: 'replay',
            action: this.restartContainer,
            showWhen: [RUNNING, FROZEN]
          },
          {
            divider: true,
            name: this.$t('containers.actions.clone'),
            icon: 'content_copy',
            action: this.cloneContainer,
            showWhen: [RUNNING, FROZEN, STOPPED],
            can: this.$auth.can('ct_clone')
          }
        ]
      };
    },
    computed: {
      availableButtons() {
        return this.buttons.filter(button => button.showWhen.indexOf(this.state) !== -1);
      },
      container() {
        return this.$store.getters.container(this.id);
      },
      state() {
        return this.container.attributes.state;
      },
      loading() {
        return this.$store.getters.containerIsLoading(this.id);
      },
      classnames() {
        return getStateStatusColorsClassnames(this.state);
      }
    },
    methods: {
      ...mapActions([
        'startContainer',
        'stopContainer',
        'freezeContainer',
        'shutdownContainer',
        'restartContainer',
        'unfreezeContainer'
      ]),
      cloneContainer(id) {
        this.$store.dispatch('openContainerCloneDialog', id);
      }
    }
  };
</script>
