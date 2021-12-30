<template>
  <nav>
    <div v-if="this.$store.state.isAuthenticated">
      <span>Logged In as....</span>
      <button @click="logout">Logout</button>
      <router-link :to="{ name: 'Home' }">Home</router-link>
      <router-link :to="{ name: 'Items' }">Items</router-link>
    </div>
    <div v-if="!this.$store.state.isAuthenticated">
      <router-link :to="{ name: 'Signup' }">Sign Up</router-link>
      <router-link :to="{ name: 'Login' }">Login</router-link>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const logout = () => {
      store.commit('logoutUser');
      router.push('/login');
    };
    return {
      logout,
    };
  },
};
</script>

<style></style>
