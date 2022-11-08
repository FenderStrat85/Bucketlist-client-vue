<template>
  <div>
    <h1>I am the home page</h1>
    <p>Is authenticated? {{ authenticationStatus }}</p>
    <p>User is logged in using {{ firstName }}</p>
    <div>
      <Vue3Lottie
        :animationData="HomepageAnimation"
        :height="600"
        :width="600"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import HomepageAnimation from '../assets/animations/homepage.json';
import { Vue3Lottie } from 'vue3-lottie';
import 'vue3-lottie/dist/style.css';

export default {
  components: {
    Vue3Lottie,
  },
  setup() {
    const store = useStore();
    const authenticationStatus = computed(() => store.state.isAuthenticated);
    const firstName = computed(() => store.state.firstName);
    return {
      authenticationStatus,
      firstName,
      HomepageAnimation,
    };
  },
};
</script>

<style></style>
