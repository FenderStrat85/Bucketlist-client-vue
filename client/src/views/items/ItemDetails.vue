<template>
  <div>
    <h1>I am the the item detail</h1>
    <p>The item's id is {{ $route.params.id }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
    };
  },
};
</script>

<style></style>
