import { createApp, provide, h } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
  from,
} from '@apollo/client/core';

import { DefaultApolloClient } from '@vue/apollo-composable';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:4000',
});

//middleware created to add headers.
//headers to set to the token that is contained inside vuex

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: store.state.accessToken || '',
    },
  }));

  return forward(operation);
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache,
});

//default main.js setup when not using graphql
// createApp(App).use(router).use(store).mount('#app');

//setup for graphql using composable api.
//useMutation, useQuery and useSubscription can now be used throughout the app.
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});
app.use(router).use(store).mount('#app');
