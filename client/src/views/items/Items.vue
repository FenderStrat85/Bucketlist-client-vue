<template>
  <div>
    <h1>I am the item list page</h1>
    <div v-for="item in items" :key="item.id">
      <router-link :to="{ name: 'ItemDetails', params: { id: item.id } }">
        <h2>{{ item.title }}</h2>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Visit Japan', id: 1 },
        { title: 'Visit China', id: 2 },
        { title: 'Visit Korea', id: 3 },
      ],
    };
  },
};
</script>

<style></style>
