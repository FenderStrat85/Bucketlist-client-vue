<template>
  <div>
    <h1>I am the item list page</h1>
    <h2>Travel Goals</h2>
    <div v-if="result && !dataIsLoaded">
      <div v-for="item in travel" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div v-if="alltravelGoals.length > 0 && dataIsLoaded">
      <div v-for="item in alltravelGoals" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div v-if="alltravelGoals.length === 0 && dataIsLoaded">
      <h3>You have no travel goals, go and add some</h3>
    </div>

    <h2>Educational Goals</h2>
    <div v-if="result && !dataIsLoaded">
      <div v-for="item in education" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div v-if="allEducationalGoals.length > 0 && dataIsLoaded">
      <div v-for="item in allEducationalGoals" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div v-if="allEducationalGoals.length === 0 && dataIsLoaded">
      <h3>You have no educational goals, go and add some</h3>
    </div>

    <h2>Personal Goals</h2>
    <div v-if="result && !dataIsLoaded">
      <div v-for="item in personal" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div v-if="allPersonalGoals.length > 0 && dataIsLoaded">
      <div v-for="item in allPersonalGoals" :key="item._id">
        <router-link
          :to="{
            name: 'GoalDetails',
            params: {
              id: item._id,
              category: item.category,
            },
          }"
        >
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div v-if="allPersonalGoals.length === 0 && dataIsLoaded">
      <h3>You have no personal goals, go and add some</h3>
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
    const dataIsLoaded = store.getters.getDataLoadedStatus;
    let travel = [];
    let education = [];
    let personal = [];
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
    onResult((queryResult) => {
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
      store.commit('setDataLoadedToTrue', true);
    });

    const alltravelGoals = store.getters.getAllTravelGoals;
    const allEducationalGoals = store.getters.getAllEducationalGoals;
    const allPersonalGoals = store.getters.getAllPersonalGoals;
    return {
      result,
      travel,
      education,
      personal,
      dataIsLoaded,
      loading,
      error,
      alltravelGoals,
      allEducationalGoals,
      allPersonalGoals,
    };
  },
};
</script>

<style></style>
