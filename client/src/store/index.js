import { createStore } from 'vuex';

const store = createStore({
  state: {
    _id: null,
    accessToken: null,
    firstName: null,
    isAuthenticated: false,
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
  },
});

export default store;
