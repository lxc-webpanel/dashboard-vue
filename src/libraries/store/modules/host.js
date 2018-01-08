import { HostService } from '../../services';

const hostId = 1;

export const HOST_REQUEST = 'HOST_REQUEST';
export const HOST_SUCCESS = 'HOST_SUCCESS';
export const HOST_FAILURE = 'HOST_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const hostState = {
  loading: true,
  host: {}
};

/**
 * Getters
 * @type {Object}
 */
const hostGetters = {
  host: state => state.host[hostId] ? state.host[hostId].attributes : state.host, // eslint-disable-line no-confusing-arrow, max-len
  hostTotalMemory: (state, getters) => (getters.host.memory && getters.host.memory.virtual.total) || 0, // eslint-disable-line max-len
  hostTotalDisk: (state, getters) => (getters.host.disk && getters.host.disk[0].total) || 0,
  hostCPUs: (state, getters) => (getters.host.cpu && getters.host.cpu.physical) || 0
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [HOST_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [HOST_SUCCESS]: (state, host) => {
    Object.assign(state, { ...host, loading: false });
  },
  [HOST_FAILURE]: (state, err) => {
    console.log(HOST_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchHost({ commit }) {
    commit(HOST_REQUEST);

    return HostService.get()
      .then((res) => {
        commit(HOST_SUCCESS, { host: res.stats });
      }).catch((err) => {
        commit(HOST_FAILURE, err);
      });
  },

  rebootHost({ commit }) {
    commit(HOST_REQUEST);

    return HostService.reboot()
      .then(() => {
        commit(HOST_SUCCESS);
      }).catch((err) => {
        commit(HOST_FAILURE, err);
      });
  }
};

// Export module
export default {
  state: hostState,
  getters: hostGetters,
  mutations,
  actions
};
