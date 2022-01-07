<template>
  <div>
    <h1>{{ category }} Card</h1>
    <h2>The title is: {{ title }}</h2>
  </div>
</template>

<script>
export default {
  props: ['title', 'category'],
};
</script>

<style></style>
