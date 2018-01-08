import { MeService } from '../../services';

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_SUCCESS = 'USERS_SUCCESS';
export const USERS_FAILURE = 'USERS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const usersState = {
  users: {},
  loading: true
};

/**
 * Getters
 * @type {Object}
 */
const usersGetters = {
  users: state => state.users
};

/**
 * Mutations
 * @type {Object}
 */
const usersMutations = {
  [USERS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [USERS_SUCCESS]: (state, users) => {
    Object.assign(state, { ...users, loading: false });
  },
  [USERS_FAILURE]: (state, err) => {
    console.log(USERS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const usersActions = {
  fetchMe({ commit }) {
    commit(USERS_REQUEST);

    MeService.get().then((res) => {
      commit(USERS_SUCCESS, res);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: usersState,
  getters: usersGetters,
  mutations: usersMutations,
  actions: usersActions
};
