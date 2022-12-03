<template>
  <div>
    <h1>I am the item list page</h1>
    <button @click="showAll">Show All</button>
    <button @click="filterCompleted">Show completed</button>
    <button @click="filterActive">Show Active</button>
    <h2>{{ state.filterMessage }}</h2>
    <h2>Travel Goals</h2>
    <div
      v-if="result || (state.allTravelGoals.length > 0 && state.dataIsLoaded)"
    >
      <div v-for="item in state.allTravelGoals" :key="item._id">
        <router-link :to="`goals/travel/${item._id}`">
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div
      v-if="
        (state.allTravelGoals.length === 0 && state.dataIsLoaded) ||
        (result && !state.dataIsLoaded && travel.length === 0)
      "
    >
      <h3>You have no travel goals, go and add some</h3>
    </div>

    <h2>Educational Goals</h2>
    <div
      v-if="
        result || (state.allEducationalGoals.length > 0 && state.dataIsLoaded)
      "
    >
      <div v-for="item in state.allEducationalGoals" :key="item._id">
        <router-link :to="`goals/education/${item._id}`">
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div
      v-if="
        (state.allEducationalGoals.length === 0 && state.dataIsLoaded) ||
        (result && !state.dataIsLoaded && education.length === 0)
      "
    >
      <h3>You have no educational goals, go and add some</h3>
    </div>

    <h2>Personal Goals</h2>
    <div
      v-if="result || (state.allPersonalGoals.length > 0 && state.dataIsLoaded)"
    >
      <div v-for="item in state.allPersonalGoals" :key="item._id">
        <router-link :to="`goals/personal/${item._id}`">
          <h2>{{ item.title }}</h2>
        </router-link>
        <h3>{{ item.category }}</h3>
      </div>
    </div>
    <div
      v-if="
        (state.allPersonalGoals.length === 0 && state.dataIsLoaded) ||
        (result && !state.dataIsLoaded && personal.length === 0)
      "
    >
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
import { storeCategories } from '../../constants/categories';
import { reactive } from 'vue';

export default {
  setup() {
    const store = useStore();
    const state = reactive({
      dataIsLoaded: store.getters.getDataLoadedStatus,
      allTravelGoals: [],
      allEducationalGoals: [],
      allPersonalGoals: [],
      filterMessage: 'Currently getting your goals'
    });

    const showAll = () => {
      state.allTravelGoals = store.getters.getAllTravelGoals;
      state.allEducationalGoals = store.getters.getAllEducationalGoals;
      state.allPersonalGoals = store.getters.getAllPersonalGoals;
      state.filterMessage = 'Currently showing all of your goals';
    };

    const filterCompleted = () => {
      state.allPersonalGoals = store.getters.getAllPersonalGoals.filter(
        (item) => item.completed === true
      );
      state.allEducationalGoals = store.getters.getAllEducationalGoals.filter(
        (item) => item.completed === true
      );
      state.allTravelGoals = store.getters.getAllTravelGoals.filter(
        (item) => item.completed === true
      );
      state.filterMessage = 'Currently showing your completed goals';
    };

    const filterActive = () => {
      state.allPersonalGoals = store.getters.getAllPersonalGoals.filter(
        (item) => item.completed === false
      );
      state.allEducationalGoals = store.getters.getAllEducationalGoals.filter(
        (item) => item.completed === false
      );
      state.allTravelGoals = store.getters.getAllTravelGoals.filter(
        (item) => item.completed === false
      );
      state.filterMessage = 'Currently showing your active goals';
    };

    if (state.dataIsLoaded) {
      showAll();
    }

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
            desiredGoal
            reasonForLearning
            desiredCompletionDate
            completedOnTime
            completed
          }
          ... on PersonalBucketListItem {
            _id
            category
            title
            areaOfLife
            about
            desiredGoal
            reasonForGoal
            desiredCompletionDate
            completed
            completedOnTime
          }
        }
      }
    `);
    onResult((queryResult) => {
      const bucketListItems = queryResult.data.getBucketListItems;
      console.log(bucketListItems);
      bucketListItems.forEach((item) => {
        store.commit('setDataLoadedToTrue', true);
        if (item && item.category && item.category === 'Travel') {
          travel.push(item);
          state.allTravelGoals.push(item);
        }
        if (item && item.category && item.category === 'Education') {
          education.push(item);
          state.allEducationalGoals.push(item);
        }
        if (item && item.category && item.category === 'Personal') {
          personal.push(item);
          state.allPersonalGoals.push(item);
        }
      });
      store.commit('populateStore', {
        category: storeCategories.TRAVEL,
        data: travel
      });
      store.commit('populateStore', {
        category: storeCategories.EDUCATIONAL,
        data: education
      });
      store.commit('populateStore', {
        category: storeCategories.PERSONAL,
        data: personal
      });

      state.allTravelGoals = store.getters.getAllTravelGoals;
      state.allEducationalGoals = store.getters.getAllEducationalGoals;
      state.allPersonalGoals = store.getters.getAllPersonalGoals;
      state.filterMessage = 'Currently showing all of your goals';
    });

    return {
      result,
      travel,
      education,
      personal,
      loading,
      error,
      state,
      filterCompleted,
      showAll,
      filterActive
    };
  }
};
</script>

<style></style>
