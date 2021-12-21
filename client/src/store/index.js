import { createStore } from 'vuex';

const store = createStore({
  state: {
    _id: null,
    userEmail: null,
    accessToken: null,
    isAuthenticated: false,
  },
  mutations: {
    loginUser(state, payload) {
      console.log('payload', payload);
      state._id = payload.loginUser._id;
      // state.userEmail = payload.userEmail;
      state.accessToken = payload.loginUser.accessToken;
      state.isAuthenticated = true;
      console.log('state at end of function', state);
    },
  },
});

export default store;
