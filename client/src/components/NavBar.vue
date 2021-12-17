<template>
  <nav>
    <span>Logged In as....</span>
    <button>Logout</button>
    <div>
      <router-link :to="{ name: 'Home' }">Home</router-link>
      <router-link :to="{ name: 'Items' }">Items</router-link>
    </div>
    <div>
      <router-link :to="{ name: 'Signup' }">Sign Up</router-link>
      <router-link :to="{ name: 'Login' }">Login</router-link>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style></style>
