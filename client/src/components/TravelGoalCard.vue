<template>
  <div>
    <h1>{{ category }} Card</h1>
    <h2>The title is: {{ title }}</h2>
    <h2>Completed? {{ completed }}</h2>
    <h2>About: {{ about }}</h2>
  </div>
</template>

<script>
export default {
  props: ['about', 'completed', 'category', 'title'],
};
</script>

<style></style>
