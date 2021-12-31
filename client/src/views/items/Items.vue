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
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export default {
  setup() {
    const items = [
      { title: 'Visit Japan', id: 1 },
      { title: 'Visit China', id: 2 },
      { title: 'Visit Korea', id: 3 },
    ];
    const { result } = useQuery(gql`
      query getBucketListItems {
        SavedItems
      }
    `);
    console.log('result.value', result.value);
    return {
      items,
      result,
    };
  },
};
</script>

<style></style>
