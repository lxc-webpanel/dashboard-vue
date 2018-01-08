<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ $t('containers.name') }}</span>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        :label="$t('actions.search')"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-if="items"
      :headers="headers"
      :items="items"
      :search="search"
      :pagination.sync="pagination">
      <tbody scope="items" slot-scope="props">
        <td><v-chip label small outline :class="classnames(props.item.state).labelColor">{{ $tc(`containers.states.${props.item.state}`) }}</v-chip></td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.cpus.formatted }}</td>
        <td>{{ props.item.memory.limit.formatted }}</td>
        <td>{{ props.item.memory.swap.formatted }}</td>
        <td>{{ props.item.ips.join(', ') }}</td>
        <td>{{ props.item.rootfs }}</td>
      </tbody>
    </v-data-table>
  </v-card>
</template>

<script>
  import { getStateStatusColorsClassnames } from '../../libraries/utils/colors';

  export default {
    name: 'containers',
    data() {
      return {
        search: '',
        pagination: {
          sortBy: 'state'
        },
        headers: [
          {
            text: this.$t('stats.state'),
            align: 'left',
            value: 'state'
          },
          {
            text: this.$t('stats.name'),
            align: 'left',
            value: 'name'
          },
          {
            text: `${this.$tc('stats.cpu', 1)}·s`,
            align: 'left',
            value: 'cpus.formatted',
            sortable: false
          },
          {
            text: this.$t('stats.memory_limit'),
            align: 'left',
            value: 'memory.limit.raw'
          },
          {
            text: this.$t('stats.swap_limit'),
            align: 'left',
            value: 'memory.swap.raw'
          },
          {
            text: 'IP·s',
            align: 'left',
            value: 'ips',
            sortable: false
          },
          {
            text: 'RootFS',
            align: 'left',
            value: 'rootfs',
            sortable: false
          }
        ]
      };
    },
    computed: {
      items() {
        return this.$store.getters.containersTableData;
      }
    },
    methods: {
      classnames(state) {
        return getStateStatusColorsClassnames(state);
      }
    },
    mounted() {
      this.$store.dispatch('fetchContainers');
    }
  };
</script>
