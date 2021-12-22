<template>
  <div>
    <h1>I am the home page</h1>
    <p>Is authenticated? {{ authenticationStatus }}</p>
    <p>User is logged in using {{ firstName }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  setup() {
    const store = useStore();
    const authenticationStatus = computed(() => store.state.isAuthenticated);
    const firstName = computed(() => store.state.firstName);
    return {
      authenticationStatus,
      firstName,
    };
  },
  // methods: {},
  // computed: {
  //   isAuthenticated() {
  //     return this.$store.state.isAuthenticated;
  //   },
  //   userEmail() {
  //     return this.$store.state.userEmail;
  //   },
  // },
};
</script>

<style></style>
