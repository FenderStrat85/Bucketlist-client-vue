<template>
  <div>
    <h1>I am the login page</h1>
    <form @submit.prevent="loginUser()">
      <label for="email">Email:</label>
      <input type="email" name="email" v-model="email" required />
      <label for="password">Password:</label>
      <input type="password" name="password" v-model="password" required />
      <button>Login</button>
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
    Vue3Lottie,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false,
    });
    const email = ref('');
    const password = ref('');

    const handleSubmit = () => {
      console.log(email.value);
      console.log(password.value);
    };
    const {
      mutate: loginUser,
      onDone,
      onError,
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
            password: password.value,
          },
        },
      }),
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
      LoginAnimation,
    };
  },
};
</script>

<style></style>
