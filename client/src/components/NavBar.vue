<template>
  <nav>
    <div class="main-nav-container" v-if="this.$store.state.isAuthenticated">
      <router-link class="button-main-nav" :to="{ name: 'Home' }"
        >Home</router-link
      >
      <router-link class="button-main-nav" :to="{ name: 'Goals' }"
        >Goals</router-link
      >
      <router-link class="button-main-nav" :to="{ name: 'TravelGoalForm' }"
        >Add Travel Goal</router-link
      >
      <router-link class="button-main-nav" :to="{ name: 'EducationalGoalForm' }"
        >Add Education Goal</router-link
      >
      <router-link class="button-main-nav" :to="{ name: 'PersonalGoalForm' }"
        >Add Personal Goal</router-link
      >
      <button class="button-main-nav" @click="logout">Logout</button>
    </div>
    <div class="login-nav-container" v-if="!this.$store.state.isAuthenticated">
      <router-link class="button-login-nav" :to="{ name: 'Signup' }"
        >Sign Up</router-link
      >
      <router-link class="button-login-nav" :to="{ name: 'Login' }"
        >Login</router-link
      >
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
      logout
    };
  }
};
</script>

<style></style>
