<template>
  <v-btn-toggle :items="filters" v-model="filter" mandatory></v-btn-toggle>
</template>

<script>
  import _reduce from 'lodash/reduce';
  import {
    ALL,
    FROZEN,
    RUNNING,
    STOPPED
  } from '../../libraries/utils/states';

  export default {
    computed: {
      filter: {
        get() {
          return this.$store.state.containers.filter;
        },
        set(value) {
          this.$store.dispatch('setContainersFilters', value);
        }
      },
      filters() {
        const all = this.$t(`containers.states.${ALL}`);
        const items = _reduce(this.$store.getters.containersStates, (filters, count, state) => {
          if (state === RUNNING || state === STOPPED || state === FROZEN) {
            const translatedState = this.$tc(`containers.states.${state}`, count);
            filters.push({
              text: `${translatedState} (${count})`,
              value: state
            });
          }

          return filters;
        }, []);

        items.unshift({ text: `${all} (${this.$store.getters.containersTotal})`, value: ALL });

        return items;
      }
    }
  };
</script>
