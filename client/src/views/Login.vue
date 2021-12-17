<template>
  <div>
    <h1>I am the login page</h1>
    <form @submit.prevent="handleSubmit">
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
export default {
  setup() {
    const email = ref('');
    const password = ref('');

    const handleSubmit = () => {
      console.log(email.value);
      console.log(password.value);
    };
    return { handleSubmit, email, password };
  },
};
</script>

<style></style>
