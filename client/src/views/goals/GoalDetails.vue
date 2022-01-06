<template>
  <div>
    <div v-if="category === 'Travel'">
      <h1>I am the the {{ category }} detail</h1>
      <p>The items id is {{ id }}</p>
      <p>The items category is {{ category }}</p>
      <p>The items title is {{ title }}</p>
    </div>
    <div v-if="category === 'Education'">
      <h1>I am the the {{ category }} detail</h1>
      <p>The items id is {{ id }}</p>
      <p>The items category is {{ category }}</p>
      <p>The items title is {{ title }}</p>
    </div>
    <div v-if="category === 'Personal'">
      <h1>I am the the {{ category }} detail</h1>
      <p>The items id is {{ id }}</p>
      <p>The items category is {{ category }}</p>
      <p>The items title is {{ title }}</p>
    </div>
  </div>
</template>

<script>
//passing the id through props as opposed to route params
//passed as params in router link but then accessed as props
export default {
  props: ['id', 'title', 'category'],
  data() {
    return {
      // idFromParam: this.$route.params.id,
    };
  },
};
</script>

<style></style>
