<template>
  <div>
    <div>
      <router-link to="/login">Login</router-link>
      <router-link to="/signup">signup</router-link>
      <router-link to="/">Home</router-link>
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
