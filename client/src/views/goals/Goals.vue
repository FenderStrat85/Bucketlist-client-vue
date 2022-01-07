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
              about: item.about,
              cloudinaryPhotoUrl: item.cloudinaryPhotoUrl,
              completed: item.completed,
              dateCompleted: item.dateCompleted,
              latitude: item.latitude,
              longitude: item.longitude,
              country: item.country,
              city: item.city,
              subject: item.subject,
              areaOfLife: item.areaOfLife,
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
          }
          ... on PersonalBucketListItem {
            _id
            category
            title
            areaOfLife
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
