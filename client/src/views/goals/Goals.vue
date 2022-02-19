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
        <h3>{{ item.category }}</h3>
      </div>
    </div>

    <div v-if="loading">Loading...</div>

    <div v-else-if="error">Error: {{ error.message }}</div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export default {
  setup() {
    const store = useStore();
    const { result, loading, error, onResult } = useQuery(gql`
      query getBucketListItems {
        getBucketListItems {
          __typename
          ... on TravelBucketListItem {
            _id
            category
            title
            about
            cloudinaryPhotoUrl
            completed
            dateCompleted
            latitude
            longitude
            country
            city
          }
          ... on EducationalBucketListItem {
            _id
            category
            title
            subject
            about
            completed
          }
          ... on PersonalBucketListItem {
            _id
            category
            title
            areaOfLife
            about
            completed
          }
        }
      }
    `);
    //New plan => Take these results and send them to the store so that they can be accessed more easily in the goal details card
    onResult((queryResult) => {
      let travel = [];
      let education = [];
      let personal = [];
      const bucketListItems = queryResult.data.getBucketListItems;
      console.log(bucketListItems);
      bucketListItems.forEach((item) => {
        if (item.category === 'Travel') {
          travel.push(item);
        }
        if (item.category === 'Education') {
          education.push(item);
        }
        if (item.category === 'Personal') {
          personal.push(item);
        }
      });
      store.commit('populateTravelStore', travel);
      store.commit('populateEducationStore', education);
      store.commit('populatePersonalStore', personal);
    });
    return {
      result,
      loading,
      error,
    };
  },
};
</script>

<style></style>
