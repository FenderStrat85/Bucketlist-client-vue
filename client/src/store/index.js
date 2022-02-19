import { createStore } from 'vuex';

const store = createStore({
  state: {
    _id: null,
    accessToken: null,
    firstName: null,
    isAuthenticated: false,
    travelGoals: [],
    educationGoals: [],
    personalGoals: [],
  },
  getters: {
    getTravelById: (state) => (id) => {
      return state.travelGoals.find((item) => item._id === id);
    },
    getEducationById: (state) => (id) => {
      return state.educationGoals.find((item) => item._id === id);
    },
    getPersonalById: (state) => (id) => {
      console.log(id);
      console.log(state.personalGoals);
      return state.personalGoals.find((item) => item._id === id);
    },
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
    populateTravelStore(state, payload) {
      state.travelGoals = payload;
    },
    populateEducationStore(state, payload) {
      state.educationGoals = payload;
    },
    populatePersonalStore(state, payload) {
      state.personalGoals = payload;
    },
  },
});

export default store;
