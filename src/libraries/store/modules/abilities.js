import { AbilitiesService } from '../../services';

export const ABILITIES_REQUEST = 'ABILITIES_REQUEST';
export const ABILITIES_SUCCESS = 'ABILITIES_SUCCESS';
export const ABILITIES_FAILURE = 'ABILITIES_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const abilitiesState = {
  abilities: {},
  loading: true
};

/**
 * Getters
 * @type {Object}
 */
const abilitiesGetters = {
  abilities: state => state.abilities
};

/**
 * Mutations
 * @type {Object}
 */
const abilitiesMutations = {
  [ABILITIES_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [ABILITIES_SUCCESS]: (state, abilities) => {
    Object.assign(state, { ...abilities, loading: false });
  },
  [ABILITIES_FAILURE]: (state, err) => {
    console.log(ABILITIES_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const abilitiesActions = {
  fetchAbilities({ commit }) {
    commit(ABILITIES_REQUEST);

    return AbilitiesService.get().then((res) => {
      commit(ABILITIES_SUCCESS, res);
    }).catch((err) => {
      commit(ABILITIES_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: abilitiesState,
  getters: abilitiesGetters,
  mutations: abilitiesMutations,
  actions: abilitiesActions
};
