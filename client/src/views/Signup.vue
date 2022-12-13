<template>
  <div>
    <h1>Welcome to Bucketlist!</h1>
    <h2>Sign up to create an account!</h2>
    <form @submit.prevent="createUser()">
      <div>
        <label for="firstName">First Name:</label>
        <input
          className="small-input"
          type="text"
          name="firstName"
          v-model="firstName"
          required
        />
        <label for="lastName">Last Name:</label>
        <input
          className="small-input"
          type="text"
          name="lastName"
          v-model="lastName"
          required
        />
        <label for="email">Email:</label>
        <input
          className="small-input"
          type="email"
          name="email"
          v-model="email"
          required
        />
        <label for="password">Password:</label>
        <input
          className="small-input"
          type="password"
          name="password"
          v-model="password"
          required
        />
        <div>
          <button class="button-login">Sign Up</button>
        </div>
      </div>
      <div v-if="state.showErrorMessage">
        <h2>There has been an error creating an account</h2>
      </div>
      <div>
        <Vue3Lottie
          :animationData="LoginAnimation"
          :height="600"
          :width="600"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
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

    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');

    const {
      mutate: createUser,
      onDone,
      onError
    } = useMutation(
      gql`
        mutation createUser($registrationInput: RegistrationUserInput) {
          createUser(registrationInput: $registrationInput) {
            _id
            accessToken
            firstName
          }
        }
      `,
      () => ({
        variables: {
          registrationInput: {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
          }
        }
      })
    );
    onDone((result) => {
      store.commit('createUser', result.data);
      router.push('/');
    });
    onError(() => {
      state.showErrorMessage = true;
    });

    return {
      createUser,
      firstName,
      lastName,
      email,
      password,
      state,
      LoginAnimation
    };
  }
};
</script>

<style></style>
