<template>
  <div>
    <h1>I am the the item detail</h1>
    <p>The item's id is {{ id }}</p>
  </div>
</template>

<script>
//passing the id through props as opposed to route params
export default {
  props: ['id'],
  data() {
    return {
      idFromParam: this.$route.params.id,
    };
  },
};
</script>

<style></style>
