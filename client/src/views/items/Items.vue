<template>
  <div>
    <h1>I am the item list page</h1>
    <div v-for="item in items" :key="item.id">
      <router-link :to="{ name: 'ItemDetails', params: { id: item.id } }">
        <h2>{{ item.title }}</h2>
      </router-link>
    </div>

    <div v-if="loading">Loading...</div>

    <div v-else-if="error">Error: {{ error.message }}</div>
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
    const { result, loading, error } = useQuery(gql`
      query getBucketListItems {
        TravelBucketListItem {
          _id
        }
        EducationalBucketListItem {
          _id
        }
        PersonalBucketListItem {
          _id
        }
      }
    `);
    console.log('result.value', result.value);
    return {
      items,
      result,
      loading,
      error,
    };
  },
};
</script>

<style></style>
