<template>
  <div>
    <div>
      <NavBar />
    </div>
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
// import Home from "./views/Home.vue";

export default {
  components: { NavBar },
};
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
