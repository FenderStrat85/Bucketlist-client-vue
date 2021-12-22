<template>
  <nav>
    <span>Logged In as....</span>
    <button @click="show">Logout</button>
    <div v-if="isAuthenticated">
      <router-link :to="{ name: 'Home' }">Home</router-link>
      <router-link :to="{ name: 'Items' }">Items</router-link>
    </div>
    <div>
      <router-link :to="{ name: 'Signup' }">Sign Up</router-link>
      <router-link :to="{ name: 'Login' }">Login</router-link>
    </div>
  </nav>
</template>

<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
export default {
  setUp() {
    const store = useStore();
    const isAuthenticated = ref(store.state.isAuthenticated);
    return {
      isAuthenticated,
    };
  },
  methods: {
    show() {
      //accessing store outside of setUp()
      console.log(this.$store.state);
    },
  },
};
</script>

<style></style>
