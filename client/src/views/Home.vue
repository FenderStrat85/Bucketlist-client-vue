<template>
  <div>
    <h1>I am the home page</h1>
    <p>Is authenticated? {{ authenticationStatus }}</p>
    <p>User is logged in using {{ userEmail }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  setup() {
    const store = useStore();
    const authenticationStatus = computed(() => store.state.isAuthenticated);
    const userEmail = computed(() => store.state.userEmail);
    return {
      authenticationStatus,
      userEmail,
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
