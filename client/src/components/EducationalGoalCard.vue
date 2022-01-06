<template>
  <div>
    <h1>{{ category }} Card</h1>
    <h1>LALALALALALA</h1>
    <h2>The id is {{ id }}</h2>
    <h2>The title is: {{ title }}</h2>
  </div>
</template>

<script>
export default {
  props: ['id', 'title', 'category'],
};
</script>

<style></style>
