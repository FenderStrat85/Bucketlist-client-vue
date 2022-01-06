<template>
  <div>
    <h1>I am the item list page</h1>
    <div v-if="result">
      <div v-for="item in result.getBucketListItems" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              title: item.title,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
      </div>
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
    const { result, loading, error } = useQuery(gql`
      query getBucketListItems {
        getBucketListItems {
          __typename
          ... on TravelBucketListItem {
            _id
            category
            title
          }
          ... on EducationalBucketListItem {
            _id
            category
            title
          }
          ... on PersonalBucketListItem {
            _id
            category
            title
          }
        }
      }
    `);
    // console.log('result', result);
    // console.log('result.value', result.value);
    return {
      result,
      loading,
      error,
    };
  },
};
</script>

<style></style>
