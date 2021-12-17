<template>
  <div>
    <div>
      <h1>Hello</h1>
      <router-link :to="{ name: 'Items' }">Items</router-link>
      <router-link :to="{ name: 'Login' }">Login</router-link>
      <router-link :to="{ name: 'Signup' }">Signup</router-link>
      <router-link :to="{ name: 'Home' }">Home</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import Home from "./views/Home.vue";

// export default {
//   name: "App",
//   components: {
//     Home,
//   },
// };
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
