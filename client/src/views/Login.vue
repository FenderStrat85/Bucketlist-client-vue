<template>
  <div>
    <h1>I am the login page</h1>
    <form @submit.prevent="loginUser(this.userInfo)">
      <label for="email">Email:</label>
      <input type="email" name="email" v-model="email" required />
      <label for="password">Password:</label>
      <input type="password" name="password" v-model="password" required />
      <button>Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const email = ref('');
    const password = ref('');

    const handleSubmit = () => {
      console.log(email.value);
      console.log(password.value);
    };

    const store = useStore();
    const userInfo = {
      _id: 1,
      userEmail: '',
      accessToken: 'TestAccessToken',
    };

    const loginUser = (userInfo) => {
      userInfo.userEmail = email.value;
      store.commit('loginUser', userInfo);
    };

    return { handleSubmit, email, password, loginUser, userInfo };
  },
  //using options api
  // methods: {
  //   loginUser(userInfo) {
  //     console.log('loginUser function inside component', userInfo);
  //     this.$store.commit('loginUser', userInfo);
  //   },
  // },
  // computed: {
  //   userInfo() {
  //     return {
  //       _id: 1,
  //       userEmail: this.email,
  //       accessToken: 'TestAccessToken',
  //     };
  //   },
  // },
};
</script>

<style></style>
