<template>
  <transition name="fade">
    <v-app>
      <v-navigation-drawer persistent light :mini-variant.sync="mini" v-model="drawer" overflow>
        <v-list class="pa-0">
          <v-list-item>
            <v-list-tile avatar tag="div">
              <v-list-tile-avatar>
                <img :src="avatar" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ me.name }}<v-chip v-if="me.admin" label small>Admin</v-chip></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon @click.stop="mini = !mini">
                  <v-icon>chevron_left</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-item>
        </v-list>
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
          <v-list-item v-for="item in items" :key="item">
            <v-list-tile :to="item.to">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-tile to="logout">
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Sign Out</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed class="lwp-toolbar" dark>
        <v-toolbar-side-icon light @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>
          <router-link to="/" tabindex="-1">
            <img class="logo" src="../../assets/logo-inline.svg" />
          </router-link>
        </v-toolbar-title>
      </v-toolbar>
      <main>
        <v-container fluid>
          <transition name="fade">
            <router-view></router-view>
          </transition>
          <lwp-notifications></lwp-notifications>
        </v-container>
      </main>
    </v-app>
  </transition>
</template>

<script>
  import md5 from 'md5';
  import { loadAndCheckAuth } from '../../libraries/plugins/auth';
  import Notifications from '../../components/Notifications';

  export default {
    name: 'layout',
    title: 'LXC Web Panel',
    components: {
      'lwp-notifications': Notifications
    },
    beforeRouteEnter(to, from, next) {
      loadAndCheckAuth(to.meta.auth || false)
        .then(() => next())
        .catch(() => {
          console.log('⛔️  Unauthorized');
          return next({ name: 'login' });
        });
    },
    data() {
      return {
        drawer: true,
        items: [
          { title: 'Dashboard', icon: 'dashboard', to: { name: 'dashboard' } },
          { title: 'Containers', icon: 'storage', to: { name: 'containers' } },
          { title: 'Users', icon: 'group' },
          { title: 'Settings', icon: 'settings' }
        ],
        mini: true,
        showSnack: true,
        type: 'success'
      };
    },
    computed: {
      me() {
        return this.$store.getters['auth/me'];
      },
      avatar() {
        return `https://www.gravatar.com/avatar/${md5(this.me.email || '')}?s=84&d=retro`;
      }
    }
  };
</script>

<style lang="scss">
  .logo {
    display: block;
    width: 150px;
  }

  .lwp-toolbar,
  .lwp-footer {
    background-color: #004159 !important;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
