import _countBy from 'lodash/countBy';
import _map from 'lodash/map';
import { ContainersService } from '../../services';
import {
  ALL,
  FREEZING,
  FROZEN,
  RESTARTING,
  RUNNING,
  SHUTTING_DOWN,
  STARTING,
  STOPPED,
  STOPPING,
  UNFREEZING
} from '../../utils/states';
import formatContainer from '../../utils/format/container';

export const CONTAINERS_REQUEST = 'CONTAINERS_REQUEST';
export const CONTAINERS_SUCCESS = 'CONTAINERS_SUCCESS';
export const CONTAINERS_FAILURE = 'CONTAINERS_FAILURE';

export const CONTAINER_REQUEST = 'CONTAINER_REQUEST';
export const CONTAINER_SUCCESS = 'CONTAINER_SUCCESS';
export const CONTAINER_FAILURE = 'CONTAINER_FAILURE';

export const CONTAINER_INFO_DIALOG_OPEN = 'CONTAINER_INFO_DIALOG_OPEN';
export const CONTAINER_INFO_DIALOG_CLOSE = 'CONTAINER_INFO_DIALOG_CLOSE';
export const CONTAINER_CREATE_DIALOG_OPEN = 'CONTAINER_CREATE_DIALOG_OPEN';
export const CONTAINER_CREATE_DIALOG_CLOSE = 'CONTAINER_CREATE_DIALOG_CLOSE';
export const CONTAINER_CLONE_DIALOG_OPEN = 'CONTAINER_CLONE_DIALOG_OPEN';
export const CONTAINER_CLONE_DIALOG_CLOSE = 'CONTAINER_CLONE_DIALOG_CLOSE';

export const SET_CONTAINERS_FILTER = 'SET_CONTAINERS_FILTER';

/**
 * Initial state
 * @type {Object}
 */
const containersState = {
  containers: {},
  loading: true,
  dialogs: {
    info: null,
    create: false,
    clone: null
  },
  filter: ALL
};

/**
 * Getters
 * @type {Object}
 */
const containersGetters = {
  containers: state => state.containers,
  containersTotal: (state, getters) => Object.keys(getters.containers).length,
  container: state => id => state.containers[id],
  containerIsLoading: (state, getters) => id => (getters.container(id) && getters.container(id).loading) || false, // eslint-disable-line max-len
  containerInDialog: (state, getters) => (state.dialogs.info && getters.container(state.dialogs.info)) || false, // eslint-disable-line max-len
  containerData(state, getters) {
    return id => formatContainer(getters.container(id), getters.hostTotalMemory);
  },
  containersStates: (state, getters) => _countBy(getters.containers, 'attributes.state'),
  containersTableData(state, getters) {
    if (Object.keys(getters.containers).length === 0) return false;
    return _map(getters.containers, container => formatContainer(container, getters.hostTotalMemory)); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
/* eslint-disable no-param-reassign */
const containersMutations = {
  [CONTAINERS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [CONTAINERS_SUCCESS]: (state, containers) => {
    Object.assign(state, { ...containers, loading: false });
  },
  [CONTAINERS_FAILURE]: (state, err) => {
    console.log(CONTAINERS_FAILURE, err);
    Object.assign(state, { loading: false });
  },

  [CONTAINER_REQUEST]: (state, { id, attributes }) => {
    state.containers[id] = {
      ...state.containers[id],
      loading: true,
      attributes: {
        ...state.containers[id].attributes,
        ...attributes
      }
    };
  },
  [CONTAINER_SUCCESS]: (state, { id, attributes }) => {
    state.containers[id] = {
      ...state.containers[id],
      loading: false,
      attributes: {
        ...state.containers[id].attributes,
        ...attributes
      }
    };
  },
  [CONTAINER_FAILURE]: (state, err, id) => {
    console.log(CONTAINER_FAILURE, err);
    state.containers[id] = {
      ...state.containers[id],
      loading: false
    };
  },

  [CONTAINER_INFO_DIALOG_OPEN]: (state, id) => {
    state.dialogs.info = id;
  },
  [CONTAINER_INFO_DIALOG_CLOSE]: (state) => {
    state.dialogs.info = null;
  },
  [CONTAINER_CREATE_DIALOG_OPEN]: (state) => {
    state.dialogs.create = true;
  },
  [CONTAINER_CREATE_DIALOG_CLOSE]: (state) => {
    state.dialogs.create = false;
  },
  [CONTAINER_CLONE_DIALOG_OPEN]: (state, id) => {
    state.dialogs.clone = id;
  },
  [CONTAINER_CLONE_DIALOG_CLOSE]: (state) => {
    state.dialogs.clone = null;
  },

  [SET_CONTAINERS_FILTER]: (state, filter) => {
    state.filter = filter;
  }
};
/* eslint-enable no-param-reassign */

/**
 * Actions
 * @type {Object}
 */
const containersActions = {
  fetchContainers({ commit }) {
    commit(CONTAINERS_REQUEST);

    ContainersService.get().then((res) => {
      setTimeout(() => {
        commit(CONTAINERS_SUCCESS, res);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  startContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { state: STARTING } });

    ContainersService.start(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { state: RUNNING } });
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  stopContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { state: STOPPING } });

    ContainersService.stop(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { state: STOPPED } });
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  freezeContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { state: FREEZING } });

    ContainersService.freeze(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { state: FROZEN } });
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  unfreezeContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { state: UNFREEZING } });

    ContainersService.unfreeze(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { state: RUNNING } });
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  shutdownContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { state: SHUTTING_DOWN } });

    ContainersService.shutdown(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { state: STOPPED } });
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  restartContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { state: RESTARTING } });

    ContainersService.restart(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { state: RUNNING } });
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  openContainerInfoDialog({ commit }, id) {
    commit(CONTAINER_INFO_DIALOG_OPEN, id);
  },
  closeContainerInfoDialog({ commit }) {
    commit(CONTAINER_INFO_DIALOG_CLOSE);
  },
  openContainerCreateDialog({ commit }) {
    commit(CONTAINER_CREATE_DIALOG_OPEN);
  },
  closeContainerCreateDialog({ commit }) {
    commit(CONTAINER_CREATE_DIALOG_CLOSE);
  },
  openContainerCloneDialog({ commit }, id) {
    commit(CONTAINER_CLONE_DIALOG_OPEN, id);
  },
  closeContainerCloneDialog({ commit }) {
    commit(CONTAINER_CLONE_DIALOG_CLOSE);
  },

  setContainersFilters({ commit }, filter) {
    commit(SET_CONTAINERS_FILTER, filter);
  }
};

// Export module
export default {
  state: containersState,
  getters: containersGetters,
  mutations: containersMutations,
  actions: containersActions
};
