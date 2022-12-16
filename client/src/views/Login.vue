<template>
  <div class="background-grey">
    <h1>Welcome to Bucketlist!</h1>
    <h2>Got an account? Let's get you logged in!</h2>
    <h2>New here? Click the button at the top to sign up!</h2>
    <form @submit.prevent="loginUser()">
      <div>
        <label for="email">Email:</label>
        <input
          class="small-input"
          type="email"
          name="email"
          v-model="email"
          required
        />
        <label for="password">Password:</label>
        <input
          class="small-input"
          type="password"
          name="password"
          v-model="password"
          required
        />
        <div>
          <button class="button-login">Login</button>
        </div>
      </div>
    </form>
    <div v-if="state.showErrorMessage">
      <h2>There has been an error logging in</h2>
    </div>
    <div>
      <Vue3Lottie :animationData="LoginAnimation" :height="600" :width="600" />
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
import LoginAnimation from '../assets/animations/login.json';
import { Vue3Lottie } from 'vue3-lottie';
import 'vue3-lottie/dist/style.css';

export default {
  components: {
    Vue3Lottie
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false
    });
    const email = ref('');
    const password = ref('');

    const handleSubmit = () => {};
    const {
      mutate: loginUser,
      onDone,
      onError
    } = useMutation(
      gql`
        mutation loginUser($loginInput: LoginUserInput) {
          loginUser(loginInput: $loginInput) {
            _id
            accessToken
            firstName
          }
        }
      `,
      () => ({
        variables: {
          loginInput: {
            email: email.value,
            password: password.value
          }
        }
      })
    );
    onDone((result) => {
      store.commit('loginUser', result.data);
      router.push('/');
    });
    onError(() => {
      state.showErrorMessage = true;
    });

    return {
      handleSubmit,
      email,
      password,
      loginUser,
      state,
      LoginAnimation
    };
  }
};
</script>

<style></style>
