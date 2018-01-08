import jwtDecode from 'jwt-decode';
import { AuthService } from '../../services';
import { getUserAbilities, getUserGroups, getUserContainers } from '../../utils/auth';
import storage from '../../utils/storage';

export const STORAGE_TOKEN_KEY = 'lwp_token';
export const STORAGE_ME_KEY = 'lwp_me';

export const TOKEN_REQUEST = 'TOKEN_REQUEST';
export const TOKEN_SUCCESS = 'TOKEN_SUCCESS';
export const TOKEN_FAILURE = 'TOKEN_FAILURE';

export const CHECK_TOKEN_REQUEST = 'CHECK_TOKEN_REQUEST';
export const CHECK_TOKEN_SUCCESS = 'CHECK_TOKEN_SUCCESS';
export const CHECK_TOKEN_FAILURE = 'CHECK_TOKEN_FAILURE';

export const LOGOUT = 'LOGOUT';

const storedToken = storage.get(STORAGE_TOKEN_KEY);

/**
 * Initial state
 * @type {Object}
 */
const authState = {
  token: storedToken || null
};

/**
 * Getters
 * @type {Object}
 */
const authGetters = {
  token: state => state.token,
  identity: ({ token }) => token ? jwtDecode(token).identity : null, // eslint-disable-line no-confusing-arrow,max-len
  me(state, getters, rootState, { users, groups, abilities, containers }) {
    const me = Object.keys(users).length > 0 && getters.identity && users[getters.identity]
      ? users[getters.identity].attributes
      : {}; // eslint-disable-line max-len

    return {
      ...me,
      abilities: getUserAbilities({ users, groups, abilities }, getters.identity),
      groups: getUserGroups({ users, groups }, getters.identity),
      containers: getUserContainers({ users, containers }, getters.identity)
    };
  }
};

/**
 * Mutations
 * @type {Object}
 */
const authMutations = {
  [TOKEN_REQUEST]: () => {
    console.log('fetching token...');
  },
  [TOKEN_SUCCESS]: (state, token) => {
    Object.assign(state, { token, me: jwtDecode(token).identity });
    storage.set(STORAGE_TOKEN_KEY, token);
  },
  [TOKEN_FAILURE]: (state, err) => {
    console.log(TOKEN_FAILURE, err);
    Object.assign(state, { token: null, me: null });
    storage.remove(STORAGE_TOKEN_KEY);
  },
  [LOGOUT]: (state) => {
    Object.assign(state, { token: null, me: null });
    storage.remove(STORAGE_TOKEN_KEY);
  }
};

/**
 * Actions
 * @type {Object}
 */
const authActions = {
  token({ commit }, { username, password }) {
    commit(TOKEN_REQUEST);

    return AuthService.token({
      username: username.trim(),
      password: password.trim()
    }).then((res) => {
      commit(TOKEN_SUCCESS, res.data.access_token);
    }).catch((err) => {
      commit(TOKEN_FAILURE, err);
    });
  },

  checkToken({ commit, getters }) {
    return new Promise((resolve) => {
      // validate local store
      if (!getters.token) {
        return resolve(false);
      }

      // remote
      AuthService.check()
        .then(() => resolve(true))
        .catch((err) => {
          commit(TOKEN_FAILURE, err);
          return resolve(false);
        });

      return undefined;
    });
  },

  logout({ commit }) {
    commit(LOGOUT);
  }
};

// Export module
export default {
  namespaced: true,
  state: authState,
  getters: authGetters,
  mutations: authMutations,
  actions: authActions
};
