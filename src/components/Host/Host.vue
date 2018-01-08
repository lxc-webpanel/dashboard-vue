<template>
  <v-card>
    <v-card-title class="grey lighten-2">
      <span class="black--text headline">{{ $t('host.name') }}</span>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="loading" indeterminate class="secondary--text"></v-progress-circular>
      <host-reboot v-if="!loading && $auth.can('host_reboot')"></host-reboot>
    </v-card-title>
    <v-card-text class="pb-0">
      <p class="pb-3" v-if="!$auth.can('host_stats')" v-text="$t('host.messages.deny_stats')"></p>
      <v-layout row wrap v-if="$auth.can('host_stats')">
        <host-card
          icon="info_outline"
          :value="uptime"
          :extras="[uptimeExtras]"
          :label="$t('stats.uptime')"></host-card>
        <host-card
          icon="data_usage"
          :value="cpu"
          unit="%"
          :extras="[cpuExtras]"
          :label="$tc('stats.cpu', 1)"></host-card>
        <host-card
          icon="memory"
          :value="memory"
          unit="%"
          :extras="[memoryExtras, memorySwapExtras]"
          :label="$t('stats.memory')"></host-card>
        <host-card
          icon="storage"
          :value="disk"
          unit="%"
          :extras="[diskExtras]"
          :label="$t('stats.disk')"></host-card>
        <host-card
          icon="developer_board"
          :value="lxc"
          :extras="[lxcExtras]"
          :label="$t('stats.lxc_version')"></host-card>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import { humanFileSize } from '../../libraries/utils/helpers';
  import HostCard from './HostCard';
  import HostReboot from './HostReboot';

  export default {
    components: {
      'host-card': HostCard,
      'host-reboot': HostReboot
    },
    computed: {
      loading() {
        return this.$store.state.host.loading;
      },
      host() {
        return this.$store.getters.host;
      },
      lxc() {
        return this.host.lxc && this.host.lxc.version;
      },
      cpu() {
        return this.host.cpu && this.host.cpu.usage;
      },
      memory() {
        return this.host.memory && this.host.memory.virtual.percent;
      },
      disk() {
        return this.host.disk && this.host.disk[0].percent;
      },
      uptime() {
        if (!this.host.uptime) return null;

        const { days, hours, minutes } = this.host.uptime;
        const d = `${days} ${this.$tc('dates.day', days)}`;
        const h = (hours && hours < 2) ? `0${hours}` : hours;
        const m = (minutes && minutes < 2) ? `0${minutes}` : minutes;

        return `${d} ${h}:${m}`;
      },
      uptimeExtras() {
        if (!this.host) return null;

        const { distrib, hostname, kernel } = this.host;

        return [
          {
            label: 'Hostname',
            value: hostname
          },
          {
            label: 'Distrib',
            value: distrib
          },
          {
            label: 'Kernel',
            value: kernel
          }
        ];
      },
      lxcExtras() {
        if (!this.host.lxc) return null;

        const { lxcpath, default_config } = this.host.lxc;

        return [
          {
            label: 'Config Path',
            value: default_config
          },
          {
            label: 'Path',
            value: lxcpath
          }
        ];
      },
      cpuExtras() {
        if (!this.host.cpu) return null;

        const { logical, model, physical } = this.host.cpu;

        return [{
          label: this.$tc('stats.physical_core', physical),
          value: physical
        },
        {
          label: this.$tc('stats.logical_core', logical),
          value: logical
        },
        {
          label: this.$t('stats.model'),
          value: model
        }];
      },
      diskExtras() {
        if (!this.host.disk) return null;

        const { name, free, total, used } = this.host.disk[0];

        return [{
          label: this.$t('stats.free'),
          value: humanFileSize(free)
        },
        {
          label: this.$t('stats.used'),
          value: humanFileSize(used)
        },
        {
          label: this.$t('stats.total'),
          value: humanFileSize(total)
        },
        {
          label: this.$t('stats.name'),
          value: name
        }];
      },

      memoryExtras() {
        if (!this.host.memory) return null;

        const { percent, total, used } = this.host.memory.virtual;

        return [{
          label: this.$t('stats.cached'),
          value: percent,
          unit: '%'
        },
        {
          label: this.$t('stats.memory_used'),
          value: humanFileSize(used)
        },
        {
          label: this.$t('stats.total'),
          value: humanFileSize(total)
        }];
      },

      memorySwapExtras() {
        if (!this.host.memory) return null;

        const { percent, total, used } = this.host.memory.swap;

        return [{
          label: 'Swap',
          value: percent,
          unit: '%'
        },
        {
          label: this.$t('stats.used'),
          value: humanFileSize(used)
        },
        {
          label: this.$t('stats.total'),
          value: humanFileSize(total)
        }];
      }
    },
    mounted() {
      this.$store.dispatch('fetchHost');
    }
  };
</script>
