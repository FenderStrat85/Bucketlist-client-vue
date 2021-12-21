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
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const state = reactive({
      showErrorMessage: false,
    });

    const handleSubmit = () => {
      console.log(email.value);
      console.log(password.value);
    };

    const store = useStore();
    const userInfoTest = {
      _id: 1,
      userEmail: '',
      accessToken: 'TestAccessToken',
    };

    const userInfo = {
      email: 'test@test.com',
      password: '123',
    };

    const loginUserTest = (userInfo) => {
      userInfo.userEmail = email.value;
      store.commit('loginUser', userInfoTest);
    };
    //variables need to be named after the type as defined in typedefs => loginInput in this case
    // on line 51 => loginInput is the type $loginInput which is defined on the line above.
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
      loginUserTest,
      userInfo,
      state,
    };
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
