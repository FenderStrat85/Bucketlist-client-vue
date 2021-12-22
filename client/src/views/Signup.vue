<template>
  <div>
    <h1>I am the sign up page</h1>
    <form @submit.prevent="createUser()">
      <label for="firstName">First Name:</label>
      <input type="text" name="firstName" v-model="firstName" required />
      <label for="lastName">Last Name:</label>
      <input type="text" name="lastName" v-model="lastName" required />
      <label for="email">Email:</label>
      <input type="email" name="email" v-model="email" required />
      <label for="password">Password:</label>
      <input type="password" name="password" v-model="password" required />
      <button>Sign Up</button>
      <div v-if="state.showErrorMessage">
        <h2>There has been an error creating an account</h2>
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

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false,
    });

    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');

    const {
      mutate: createUser,
      onDone,
      onError,
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
            password: password.value,
          },
        },
      }),
    );
    onDone((result) => {
      store.commit('createUser', result.data);
      router.push('/');
    });
    onError(() => {
      state.showErrorMessage = true;
    });

    return { createUser, firstName, lastName, email, password, state };
  },
};
</script>

<style></style>
