/**
 * Vuex docs
 * https://vuex.vuejs.org/zh-cn
 * https://github.com/vuejs/vue-hackernews-2.0
 */

import Vue from 'vue';
import Vuex from 'vuex';

// // Make sure state writeable
// import * as state from './state' // prop readonly
import state from './state';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';
import * as modules from './modules';

Vue.use(Vuex);

const strict = process.env.NODE_ENV !== 'production';

const plugins = [];

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: modules.default,
  strict,
  plugins
});

// ## Initial
// store.dispatch('initToken')
// // change axios authorization header
// axios.defaults.headers.Authorization = `Bearer ${storage.get('wedn_net_access_token')}`

// ## Hot module replacement
if (module.hot) {
  module.hot.accept([
    './getters',
    './mutations',
    './actions',
    './modules/abilities',
    './modules/auth',
    './modules/containers',
    './modules/groups',
    './modules/host',
    './modules/notifications',
    './modules/users'
  ], () => {
    store.hotUpdate({
      getters: require('./getters'),
      mutations: require('./mutations'),
      actions: require('./actions'),
      modules: {
        abilities: require('./modules/abilities'),
        auth: require('./modules/auth'),
        containers: require('./modules/containers'),
        groups: require('./modules/groups'),
        host: require('./modules/host'),
        notifications: require('./modules/notifications'),
        users: require('./modules/users')
      }
    });
  });
}

export default store;
