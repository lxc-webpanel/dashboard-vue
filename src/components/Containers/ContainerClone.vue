<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" width="500">
      <v-card v-if="active">
        <v-toolbar dark class="primary">
          <v-toolbar-title>{{ $t('containers.actions.clone') }} {{ cloned.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <v-container fluid class="pb-0">
            <v-layout row wrap>
              <v-flex xs12>
                <span class="headline">{{ $t('containers.form.container_name.label') }}</span>
                <p class="caption">{{ $t('containers.form.container_name.help') }}</p>
              </v-flex>
              <v-flex xs12>
                <text-field
                  :label="$t('containers.form.name')"
                  v-model="form.name"
                  rules="required|containerName|maxLength:64"></text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-list two-line v-if="showShutdownOption || confirm.length > 0">
            <template v-for="item in confirm">
              <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
              <v-divider v-else-if="item.divider" :inset="item.inset"></v-divider>
              <v-list-tile v-else :key="item.title">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <template v-if="showShutdownOption">
              <v-divider></v-divider>
              <v-subheader>{{ $t('form.optional') }}</v-subheader>
              <v-list-tile avatar>
                <v-list-tile-action>
                  <v-switch v-model="notifications"></v-switch>
                </v-list-tile-action>
                <v-list-tile-content @click="notifications = !notifications">
                  <v-list-tile-title>{{ $t('containers.form.shutdown_target_container.label') }}</v-list-tile-title>
                  <v-list-tile-sub-title v-html="notifications ?
                    $t('containers.form.shutdown_target_container.will') :
                    $t('containers.form.shutdown_target_container.will_not')">
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="closeDialog">{{ $t('actions.cancel') }}</v-btn>
          <v-btn primary :disabled="isValid">{{ $t('actions.clone') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import TextField from '../Form/TextField';
  import { FROZEN, RUNNING } from '../../libraries/utils/states';

  export default {
    components: {
      'text-field': TextField
    },
    data() {
      return {
        notifications: false,
        form: {
          name: {}
        }
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.containers.dialogs.clone !== null;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      id() {
        return this.$store.state.containers.dialogs.clone;
      },
      cloned() {
        return this.id !== null ? this.$store.getters.containerData(this.id) : false;
      },
      confirm() {
        const settings = [];
        const cloned = this.cloned;

        if (cloned) {
          if (cloned.cpus.raw !== null || cloned.memory.limit.raw.length > 0) {
            settings.push(...[
              { divider: true, inset: false },
              { header: this.$t('stats.settings') }
            ]);
          }

          if (cloned.cpus.raw !== null) {
            settings.push({
              subtitle: `${this.$tc('stats.cpu', cloned.cpus.raw.length)} ${cloned.cpus.formatted}`,
              title: this.$tc('stats.cpu', cloned.cpus.raw.length)
            });
          }

          if (cloned.memory.limit.raw.length > 0) {
            settings.push(...[
              {
                subtitle: cloned.memory.limit.formatted,
                title: this.$t('stats.memory_limit')
              },
              {
                subtitle: cloned.memory.swap.formatted,
                title: this.$t('stats.swap_limit')
              }
            ]);
          }
        }

        return settings;
      },
      isValid() {
        return !!this.form.name.invalid;
      },
      showShutdownOption() {
        let show = false;

        if (this.cloned) {
          show = this.cloned.state === FROZEN || this.cloned.state === RUNNING;
        }

        return show;
      }
    },
    methods: {
      closeDialog() {
        this.name = {};
        this.$store.dispatch('closeContainerCloneDialog');
      }
    }
  };
</script>
