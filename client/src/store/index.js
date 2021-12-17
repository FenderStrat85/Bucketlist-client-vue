import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    isAuthenticated: false,
  },
});
