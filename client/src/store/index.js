import { createStore } from 'vuex';

const store = createStore({
  state: {
    _id: null,
    accessToken: null,
    firstName: null,
    isAuthenticated: false,
    dataIsLoaded: false,
    travelGoals: [],
    educationGoals: [],
    personalGoals: []
  },
  getters: {
    getUserId: (state) => {
      return state._id;
    },
    getDataLoadedStatus: (state) => {
      return state.dataIsLoaded;
    },
    getTravelById: (state) => (id) => {
      return state.travelGoals.find((item) => item._id === id);
    },
    getEducationById: (state) => (id) => {
      return state.educationGoals.find((item) => item._id === id);
    },
    getPersonalById: (state) => (id) => {
      return state.personalGoals.find((item) => item._id === id);
    },
    getAllTravelGoals: (state) => {
      return state.travelGoals;
    },
    getAllEducationalGoals: (state) => {
      return state.educationGoals;
    },
    getAllPersonalGoals: (state) => {
      return state.personalGoals;
    }
  },
  mutations: {
    loginUser(state, payload) {
      state._id = payload.loginUser._id;
      state.accessToken = payload.loginUser.accessToken;
      state.firstName = payload.loginUser.firstName;
      state.isAuthenticated = true;
    },
    createUser(state, payload) {
      state._id = payload.createUser._id;
      state.accessToken = payload.createUser.accessToken;
      state.firstName = payload.createUser.firstName;
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
    },
    setDataLoadedToTrue(state, payload) {
      state.dataIsLoaded = payload;
    },
    populateStore(state, payload) {
      if (payload.data.length > 0) {
        state[payload.category] = payload.data;
      } else {
        state[payload.category] = [];
      }
    },
    addGoal(state, payload) {
      state[payload.category].push(payload.data);
    },
    updateGoal(state, payload) {
      let index = state[payload.category].findIndex(
        (item) => item._id === payload.data._id
      );
      state[payload.category][index] = payload.data;
    },
    removeGoal(state, payload) {
      let index = state[payload.category].findIndex((item) => {
        if (item._id === payload.id) {
          return true;
        }
      });
      state[payload.category].splice(index, 1);
    }
  }
});

export default store;
