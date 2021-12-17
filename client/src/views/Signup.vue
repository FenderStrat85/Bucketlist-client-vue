<template>
  <div>
    <h1>I am the sign up page</h1>
    <form @submit.prevent="handleSubmit">
      <label for="firstName">First Name:</label>
      <input type="text" name="firstName" v-model="firstName" required />
      <label for="lastName">Last Name:</label>
      <input type="text" name="lastName" v-model="lastName" required />
      <label for="email">Email:</label>
      <input type="email" name="email" v-model="email" required />
      <label for="password">Password:</label>
      <input type="password" name="password" v-model="password" required />
      <button>Sign Up</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');

    const handleSubmit = () => {
      console.log(firstName.value);
      console.log(lastName.value);
      console.log(email.value);
      console.log(password.value);
    };
    return { handleSubmit, firstName, lastName, email, password };
  },
};
</script>

<style></style>
