<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" fullscreen>
      <v-card v-if="active">
        <v-toolbar dark class="primary">
          <v-toolbar-title>{{ $t('containers.actions.create') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step step="1" :rules="[() => !stepError('general')]" :complete="step > 1">{{ $t('general') }}</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2" :rules="[() => !stepError('cpuMemory')]" :complete="step > 2">
                {{ $tc('stats.cpu') }} / {{ $t('stats.memory') }}<small>{{ $t('form.optional') }}</small>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3" :rules="[() => !stepError('networks')]" :complete="step > 3">{{ $t('stats.network') }}<small>{{ $t('form.optional') }}</small></v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="4" :complete="step > 4">{{ $t('actions.confirm') }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-content step="1">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex md6 xs12>
                    <v-container fluid class="pa-0">
                      <v-layout row wrap>
                        <v-flex md3 xs12>
                          <span class="headline">{{ $t('containers.form.container_name.label') }}</span>
                          <p class="caption">{{ $t('containers.form.container_name.help') }}</p>
                        </v-flex>
                        <v-flex offset-md1 md7 xs12>
                          <text-field
                            :label="$t('containers.form.name')"
                            v-model="form.general.name"
                            rules="required|containerName|maxLength:64"></text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <v-flex md6 xs12>
                    <v-container fluid class="pa-0">
                      <v-layout row wrap>
                        <v-flex md3 xs12>
                          <span class="headline">{{ $t('containers.form.template.label') }}</span>
                          <p class="caption">{{ $t('containers.form.template.help') }}</p>
                        </v-flex>
                        <v-flex lg7 offset-md1 md8 xs12>
                          <select-field
                            :label="$t('containers.form.template.label')"
                            :items="templates"
                            v-model="form.general.template"
                            persistent-hint
                            single-line
                            bottom
                            rules="required"></select-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-btn flat @click="closeDialog">{{ $t('actions.cancel') }}</v-btn>
              <v-btn primary @click="step = 2" :disabled="!stepCompleted('general')">{{ $t('actions.continue') }}</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex lg6 xs12>
                    <v-container fluid class="pa-0">
                      <v-layout row wrap>
                        <v-flex md3 xs12>
                          <span class="headline">{{ $t('containers.form.cpu.label') }}</span>
                          <p class="caption">{{ $t('containers.form.cpu.help') }}</p>
                        </v-flex>
                        <v-flex lg7 offset-md1 md8 xs12>
                          <select-field
                            :label="$t('containers.form.cpu.label')"
                            :items="cpus"
                            v-model="form.cpuMemory.cpus"
                            multiple
                            chips
                            :hint="$t('containers.form.cpu.hint')"
                            persistent-hint
                            rules="$each:numeric"></select-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <v-flex lg6 xs12>
                    <v-container fluid class="pa-0">
                      <v-layout row wrap>
                        <v-flex md3 xs12>
                          <span class="headline">{{ $t('containers.form.memory.label') }}</span>
                          <p class="caption">{{ $t('containers.form.memory.help') }}</p>
                        </v-flex>
                        <v-flex offset-md1 md8 xs12>
                          <v-container fluid class="pa-0">
                            <v-layout row wrap>
                              <v-flex sm9 xs7>
                                <slider-field
                                  :label="$t('containers.form.memory.label')"
                                  :max="memoryMax"
                                  v-model="form.cpuMemory.memory.limit"
                                  :hint="`${$t('containers.form.memory.hint')} (max. ${memoryMax} MB)`"
                                  persistent-hint
                                  rules="numeric"></slider-field>
                              </v-flex>
                              <v-flex sm2 offset-xs1 xs4>
                                <v-text-field
                                  :value.number="form.cpuMemory.memory.limit.value"
                                  disabled
                                  type="number"
                                  suffix="MB"></v-text-field>
                              </v-flex>
                              <v-flex sm9 xs7>
                                <slider-field
                                  :label="$t('stats.swap')"
                                  :max="swapMax"
                                  v-model="form.cpuMemory.memory.swap"
                                  :hint="`${$t('containers.form.memory.hint')} (max. ${swapMax} MB)`"
                                  persistent-hint
                                  rules="numeric"></slider-field>
                              </v-flex>
                              <v-flex sm2 offset-xs1 xs4>
                                <v-text-field
                                  :value.number="form.cpuMemory.memory.swap.value"
                                  disabled
                                  type="number"
                                  suffix="MB"></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-btn flat @click="step = 1">{{ $t('actions.back') }}</v-btn>
              <v-btn primary :disabled="stepError('cpuMemory')" @click="step = 3">{{ $t('actions.continue') }}</v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-container fluid class="pa-0">
                <v-expansion-panel expand>
                  <v-expansion-panel-content v-for="(network, i) in form.networks" :key="i" v-model="network.expanded">
                    <div slot="header">
                      <v-btn icon small @click.stop="removeNetwork"><v-icon>close</v-icon></v-btn><span :class="{ 'red--text': haveErrors(network) }">{{ $t('stats.network_card') }} #{{ i + 1 }}</span><v-icon v-if="haveErrors(network)" class="red--text">warning</v-icon>
                    </div>
                    <v-card>
                      <v-card-text class="grey lighten-4">
                        <v-container fluid class="pa-0">
                          <v-layout row wrap>
                            <v-flex sm6 xs12>
                              <v-container fluid class="pa-0">
                                <v-layout row wrap>
                                  <v-flex md4 xs12>
                                    <span class="headline">{{ $t('containers.form.network_card.simple.label') }}</span>
                                    <p class="caption">{{ $t('containers.form.network_card.simple.help') }}</p>
                                  </v-flex>
                                  <v-flex offset-md1 md7 xs12>
                                    <v-container fluid class="pa-0">
                                      <v-layout row wrap>
                                        <v-flex xs12>
                                          <text-field
                                            :label="$t('containers.form.network_card.link.label')"
                                            :hint="$t('containers.form.network_card.link.hint')"
                                            persistent-hint
                                            v-model="network.link"
                                            rules="network"></text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                          <text-field
                                            :label="$t('containers.form.network_card.ips.label')"
                                            :hint="$t('containers.form.network_card.ips.hint')"
                                            persistent-hint
                                            multi-line
                                            v-model="network.ips"
                                            rules="ip:both:true"></text-field>
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-flex>
                            <v-flex offset-sm1 sm5 xs12>
                              <v-container fluid class="pa-0">
                                <v-layout row wrap>
                                  <v-flex xs12>
                                    <span class="headline">{{ $t('containers.form.network_card.advanced.label') }}</span>
                                    <p class="caption">{{ $t('containers.form.network_card.advanced.help') }}</p>
                                  </v-flex>
                                  <v-flex xs12>
                                    <text-field
                                      :label="$t('containers.form.network_card.name.label')"
                                      :hint="$t('containers.form.network_card.name.hint')"
                                      persistent-hint
                                      v-model="network.name"
                                      rules="network"></text-field>
                                  </v-flex>
                                  <v-flex xs12>
                                    <text-field
                                      :label="$t('containers.form.network_card.vlan.label')"
                                      v-model="network.vlan"
                                      type="number"
                                      rules="numeric"></text-field>
                                  </v-flex>
                                  <v-flex xs12>
                                    <text-field
                                      :label="$t('containers.form.network_card.mtu.label')"
                                      v-model="network.mtu"
                                      type="number"
                                      rules="numeric"></text-field>
                                  </v-flex>
                                  <v-flex xs12>
                                    <text-field
                                      :label="$t('containers.form.network_card.hw_address.label')"
                                      v-model="network.hwaddr"
                                      rules="macAddress"></text-field>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-container>
              <div>
                <v-spacer></v-spacer>
                <v-btn primary @click="addNetwork">{{ $t('containers.form.network_card.add') }}</v-btn>
              </div>
              <v-btn flat @click="step = 2">{{ $t('actions.back') }}</v-btn>
              <v-btn primary :disabled="stepError('networks')" @click="step = 4">{{ $t('actions.continue') }}</v-btn>
            </v-stepper-content>
            <v-stepper-content step="4">
              <v-list two-line>
                <template v-for="item in confirm">
                  <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                  <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                  <v-list-tile v-else v-bind:key="item.title">
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.title"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
              <v-btn flat @click="step = 3">{{ $t('actions.back') }}</v-btn>
              <v-btn primary @click="step = 1">{{ $t('actions.create') }}</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import _isPlainObject from 'lodash/isPlainObject';
  import _pickBy from 'lodash/pickBy';
  import _each from 'lodash/each';
  import _reduce from 'lodash/reduce';
  import _every from 'lodash/every';
  import _some from 'lodash/some';
  import _filter from 'lodash/filter';
  import TextField from '../Form/TextField';
  import SelectField from '../Form/SelectField';
  import SliderField from '../Form/SliderField';
  import { BToMB, MBToB } from '../../libraries/utils/helpers';

  export default {
    components: {
      'text-field': TextField,
      'select-field': SelectField,
      'slider-field': SliderField
    },
    data() {
      return {
        form: {
          general: {
            name: {},
            template: {}
          },
          cpuMemory: {
            cpus: {},
            memory: {
              limit: {},
              swap: {}
            }
          },
          networks: []
        },
        step: 0,
        templates: [
          { text: 'Ubuntu', value: 'ubuntu' },
          { text: 'Debian', value: 'debian' }
        ]
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.containers.dialogs.create;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      cpus() {
        const cpus = [];

        for (let i = 0; i < this.$store.getters.hostCPUs; i += 1) {
          cpus.push({
            text: `CPU ${i}`,
            value: i
          });
        }

        return cpus;
      },
      memoryMax() {
        return Math.floor(BToMB(this.$store.getters.hostTotalMemory));
      },
      swapMax() {
        return Math.floor(BToMB(this.$store.getters.hostTotalDisk));
      },
      confirm() {
        const general = [
          { header: this.$t('general') },
          {
            subtitle: this.form.general.name.value,
            title: this.$t('containers.form.name')
          },
          {
            subtitle: this.form.general.template.value,
            title: this.$t('containers.form.template.label')
          }
        ];

        const cpuMemory = [];
        const cpuMemoryForm = this.form.cpuMemory;

        if (cpuMemoryForm.cpus.value && cpuMemoryForm.cpus.value.length > 0) {
          const cpus = [
            { divider: true, inset: false },
            { header: this.$tc('stats.cpu', cpuMemoryForm.cpus.value.length) },
            {
              subtitle: cpuMemoryForm.cpus.value.join(','),
              title: this.$tc('stats.cpu', cpuMemoryForm.cpus.value.length)
            }
          ];

          cpuMemory.push(...cpus);
        }

        const limit = cpuMemoryForm.memory.limit.value;
        const swap = cpuMemoryForm.memory.swap.value;

        const memory = [
          { divider: true, inset: false },
          { header: this.$t('stats.memory') },
          {
            subtitle: limit === 0 ? this.$t('unlimited') : `${limit} MB - ${MBToB(limit)} B`,
            title: this.$t('stats.memory_limit')
          },
          {
            subtitle: swap === 0 ? this.$t('unlimited') : `${swap} MB - ${MBToB(swap)} B`,
            title: this.$t('stats.swap_limit')
          }
        ];

        cpuMemory.push(...memory);

        const networks = [];

        if (this.form.networks.length > 0) {
          networks.push(
            { divider: true, inset: false },
            { header: this.$t('stats.network') }
          );

          const networksSettings = _reduce(this.form.networks, (acc, network, index) => {
            const settings = [];

            _each(_pickBy(network, _isPlainObject), (setting) => {
              if (setting.value) {
                const value = setting.value.split('\n').join(', ');
                const name = setting.label;

                settings.push(
                  `<span>${name}: <strong>${value}</strong></span>`
                );
              }
            });

            if (settings.length > 0) {
              if (index !== 0) {
                acc.push({ divider: true, inset: true });
              }

              acc.push({
                title: `${this.$t('stats.network_card')} #${index + 1}`,
                subtitle: settings.join(' / ')
              });
            }

            return acc;
          }, []);

          networks.push(...networksSettings);
        }

        return [...general, ...cpuMemory, ...networks];
      }
    },
    methods: {
      addNetwork() {
        // Need to push all "future" keys for Vue to able to watch them!
        this.form.networks.push({
          expanded: true,
          advanced: false,
          hwaddr: {},
          link: {},
          name: {},
          vlan: {},
          mtu: {},
          ips: {}
        });
      },
      removeNetwork(i) {
        this.form.networks.splice(i, 1);
      },
      stepError(step) {
        let error = false;

        if (this.form[step]) {
          const formItems = this.form[step];

          if (Array.isArray(formItems)) {
            error = _some(formItems, items => this.haveErrors(items));
          } else {
            error = this.haveErrors(formItems);
          }
        }

        return error;
      },
      stepCompleted(step) {
        let completed = false;

        if (this.form[step]) {
          const formItems = this.form[step];

          if (Array.isArray(formItems)) {
            completed = _every(formItems, items => this.completed(items));
          } else {
            completed = this.completed(formItems);
          }
        }

        return completed;
      },
      haveErrors(items) {
        return _some(_filter(items, _isPlainObject), { invalid: true, dirty: true });
      },
      completed(items) {
        return _every(_filter(items, _isPlainObject), { invalid: false });
      },
      closeDialog() {
        this.step = 0;
        this.$store.dispatch('closeContainerCreateDialog');
      }
    }
  };
</script>
