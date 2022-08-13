<template>
  <div>
    <h1>I am the Personal Goal Form</h1>
    <form @submit.prevent="addPersonalBucketListItem()">
      <label for="title">Title: </label>
      <textarea
        type="text"
        name="title"
        v-model="title"
        :placeholder="placeholders.title"
        required
      />
      <label for="about">About: </label>
      <textarea
        type="text"
        name="about"
        v-model="about"
        :placeholder="placeholders.about"
        required
      />
      <label for="areaOfLife">Area of life: </label>
      <textarea
        type="text"
        name="areaOfLife"
        v-model="areaOfLife"
        :placeholder="placeholders.areaOfLife"
        required
      />
      <label for="desiredGoal">Desired goal: </label>
      <textarea
        type="text"
        name="desiredGoal"
        v-model="desiredGoal"
        :placeholder="placeholders.desiredGoal"
        required
        cols="30"
        rows="10"
      />
      <label for="reasonForGoal">Reason for your goal: </label>
      <textarea
        type="text"
        name="reasonForGoal"
        v-model="reasonForGoal"
        :placeholder="placeholders.reasonForGoal"
        required
      />
      <label for="desiredCompletionDate">Desired completion date: </label>
      <textarea
        type="text"
        name="desiredCompletionDate"
        v-model="desiredCompletionDate"
        :placeholder="placeholders.desiredCompletionDate"
        required
      />
      <span>Have you completed this goal?</span>
      <input
        type="radio"
        id="completed"
        v-bind:value="true"
        v-model="completed"
      />
      <label for="completed">Completed</label>
      <input
        type="radio"
        id="notCompleted"
        v-bind:value="false"
        v-model="completed"
      />
      <label for="completed">Not Completed</label>
      <div v-if="completed">
        <span>If completed, did you complete this goal on time?</span>
        <label for="completedOnTime">Completed on time</label>
        <input
          type="radio"
          id="completedOnTime"
          v-bind:value="true"
          v-model="completedOnTime"
        />
        <label for="completedOnTime">Not completed on time</label>
        <input
          type="radio"
          id="notCompletedOnTime"
          v-bind:value="false"
          v-model="completedOnTime"
        />
      </div>
      <button>Submit</button>
    </form>
    <div v-if="state.showErrorMessage">
      <h2>There has been an error submitting your goal</h2>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
import { personalGoalFormPlaceholders } from '../constants/formPlaceholders';
import { categories, storeCategories } from '../constants/categories';
import { logErrorMessages } from '@vue/apollo-util';
import { useStore } from 'vuex';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false,
    });
    const placeholders = personalGoalFormPlaceholders;
    const title = ref('');
    const about = ref('');
    const areaOfLife = ref('');
    const desiredGoal = ref('');
    const reasonForGoal = ref('');
    const desiredCompletionDate = ref('');
    const completed = ref(false);
    const completedOnTime = ref(false);

    const {
      mutate: addPersonalBucketListItem,
      onDone,
      onError,
    } = useMutation(
      gql`
        mutation addPersonalBucketListItem(
          $personalItemInput: PersonalBucketListInput
        ) {
          addPersonalBucketListItem(personalItemInput: $personalItemInput) {
            _id
            userId
            category
            title
            about
            areaOfLife
            desiredGoal
            reasonForGoal
            desiredCompletionDate
            completed
            completedOnTime
          }
        }
      `,
      () => ({
        variables: {
          personalItemInput: {
            category: categories.PERSONAL,
            title: title.value,
            about: about.value,
            areaOfLife: areaOfLife.value,
            desiredGoal: desiredGoal.value,
            reasonForGoal: reasonForGoal.value,
            desiredCompletionDate: desiredCompletionDate.value,
            completed: completed.value,
            completedOnTime: completedOnTime.value,
          },
        },
      }),
    );
    onDone((result) => {
      console.log('RESULT.data', result.data);
      store.commit('addGoal', {
        category: storeCategories.PERSONAL,
        data: result.data.addPersonalBucketListItem,
      });
      router.push('/');
    });
    onError((e) => {
      logErrorMessages(e);
      // shows the full error from grpahql
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });

    return {
      placeholders,
      title,
      about,
      areaOfLife,
      desiredGoal,
      reasonForGoal,
      desiredCompletionDate,
      completed,
      completedOnTime,
      addPersonalBucketListItem,
      state,
    };
  },
};
</script>

<style></style>
