<template>
  <div>
    <v-card>
      <v-card-title class="grey lighten-2">
        <span class="black--text headline">{{ $t('containers.name') }}</span>
        <v-spacer></v-spacer>
        <containers-filters v-if="total > 0 && !loading"></containers-filters>
        <v-progress-circular v-if="loading" indeterminate class="secondary--text"></v-progress-circular>
      </v-card-title>
      <v-card-text class="pb-0" style="position: relative;">
        <p v-if="!loading && total === 0" v-text="$t('messages.no_containers')"></p>
        <v-layout row wrap>
          <container-card v-for="container in containers" :key="container.id" :id="container.id"></container-card>
        </v-layout>
        <v-fab-transition v-if="$auth.can('ct_create')">
          <v-btn
            absolute
            fab
            right
            v-show="!loading"
            class="grey lighten-2 black--text"
            style="bottom: 16px;"
            @click.stop="$store.dispatch('openContainerCreateDialog')"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-text>
    </v-card>
    <container-dialog></container-dialog>
    <container-create></container-create>
    <container-clone></container-clone>
  </div>
</template>

<script>
  import _filter from 'lodash/filter';
  import ContainerCard from './ContainerCard';
  import ContainerDialog from './ContainerDialog';
  import ContainersFilters from './ContainersFilters';
  import ContainerCreate from './ContainerCreate';
  import ContainerClone from './ContainerClone';
  import {
    ALL,
    FROZEN,
    RUNNING,
    STOPPED
  } from '../../libraries/utils/states';

  export default {
    data() {
      return {
        name: {
          value: '',
          error: false
        }
      };
    },
    components: {
      'container-card': ContainerCard,
      'container-dialog': ContainerDialog,
      'containers-filters': ContainersFilters,
      'container-create': ContainerCreate,
      'container-clone': ContainerClone
    },
    computed: {
      total() {
        return this.$store.getters.containersTotal;
      },
      loading() {
        return this.$store.state.containers.loading;
      },
      containers() {
        switch (this.$store.state.containers.filter) {
          case ALL:
            return this.$store.getters.containers;
          case RUNNING:
            return _filter(this.$store.getters.containers, c => c.attributes.state === RUNNING);
          case STOPPED:
            return _filter(this.$store.getters.containers, c => c.attributes.state === STOPPED);
          case FROZEN:
            return _filter(this.$store.getters.containers, c => c.attributes.state === FROZEN);
          default:
            throw new Error(`Unknown filter: ${this.$store.state.containers.filter}`);
        }
      }
    },
    mounted() {
      this.$store.dispatch('fetchContainers');
    }
  };
</script>

