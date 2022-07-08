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
    personalGoals: [],
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
      console.log(id);
      console.log(state.personalGoals);
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
    setDataLoadedToTrue(state, payload) {
      state.dataIsLoaded = payload;
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
    addPersonalGoal(state, payload) {
      state.personalGoals.push(payload);
    },
  },
});

export default store;
