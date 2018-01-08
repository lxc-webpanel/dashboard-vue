import { GroupsService } from '../../services';

export const GROUPS_REQUEST = 'GROUPS_REQUEST';
export const GROUPS_SUCCESS = 'GROUPS_SUCCESS';
export const GROUPS_FAILURE = 'GROUPS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const groupsState = {
  groups: {},
  loading: true
};

/**
 * Getters
 * @type {Object}
 */
const groupsGetters = {
  groups: state => state.groups
};

/**
 * Mutations
 * @type {Object}
 */
const groupsMutations = {
  [GROUPS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [GROUPS_SUCCESS]: (state, groups) => {
    Object.assign(state, { ...groups, loading: false });
  },
  [GROUPS_FAILURE]: (state, err) => {
    console.log(GROUPS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const groupsActions = {
  fetchGroups({ commit }) {
    commit(GROUPS_REQUEST);

    return GroupsService.get().then((res) => {
      commit(GROUPS_SUCCESS, res);
    }).catch((err) => {
      commit(GROUPS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: groupsState,
  getters: groupsGetters,
  mutations: groupsMutations,
  actions: groupsActions
};
