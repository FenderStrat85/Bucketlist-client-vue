<template>
  <div>
    <div v-if="!state.isInEditMode">
      <h1>{{ personalGoal.category }} Card</h1>
      <h2>The title is: {{ personalGoal.title }}</h2>
      <h2>Completed? {{ personalGoal.completed }}</h2>
      <h2>About: {{ personalGoal.about }}</h2>
      <button @click="deleteBucketListItem()">Delete Goal</button>
      <div v-if="state.showErrorMessage">
        <h2>There has been an error deleting this item</h2>
      </div>
      <button @click="setToEditMode()">Edit your goal</button>
    </div>
    <div v-if="state.isInEditMode">
      <h1>I am the Personal Goal Form</h1>
      <form @submit.prevent="updatePersonalBucketListItem()">
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
      <button @click="exitEditMode()">Return to Goal</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { categories, storeCategories } from '../constants/categories';
export default {
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      showErrorMessage: false,
      isInEditMode: false,
    });
    const personalGoal = store.getters.getPersonalById(props.id);

    console.log('personalGaol!!!', personalGoal);
    const placeholders = {
      title: personalGoal.title,
      about: personalGoal.about,
      areaOfLife: personalGoal.areaOfLife,
      desiredGoal: personalGoal.desiredGoal,
      reasonForGoal: personalGoal.reasonForGoal,
      desiredCompletionDate: personalGoal.desiredCompletionDate,
      completed: personalGoal.completed,
      completedOnTime: personalGoal.completedOnTime,
    };

    const title = ref(personalGoal.title);
    const about = ref(personalGoal.about);
    const areaOfLife = ref(personalGoal.areaOfLife);
    const desiredGoal = ref(personalGoal.desiredGoal);
    const reasonForGoal = ref(personalGoal.reasonForGoal);
    const desiredCompletionDate = ref(personalGoal.desiredCompletionDate);
    const completed = ref(personalGoal.completed);
    const completedOnTime = ref(personalGoal.completed);

    const setToEditMode = () => (state.isInEditMode = true);
    const exitEditMode = () => (state.isInEditMode = false);

    const {
      mutate: updatePersonalBucketListItem,
      onDone: onDoneUpdate,
      onError: onErrorUpdate,
    } = useMutation(
      gql`
        mutation updatePersonalBucketListItem(
          $personalItemInput: PersonalBucketListInput
        ) {
          updatePersonalBucketListItem(personalItemInput: $personalItemInput) {
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
            _id: personalGoal._id,
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
    onDoneUpdate((result) => {
      store.commit('updateGoal', {
        data: result.data.updatePersonalBucketListItem,
        category: storeCategories.PERSONAL,
      });
      router.push('/');
    });
    onErrorUpdate((e) => {
      // shows the full error from graphql
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });

    const {
      mutate: deleteBucketListItem,
      onDone: onDoneDelete,
      onError: onErrorDelete,
    } = useMutation(
      gql`
        mutation deleteBucketListItem($deleteItemInput: DeleteItemInput) {
          deleteBucketListItem(deleteItemInput: $deleteItemInput) {
            message
          }
        }
      `,
      () => ({
        variables: {
          deleteItemInput: {
            _id: props.id,
            category: personalGoal.category,
          },
        },
      }),
    );
    onDoneDelete(() => {
      store.commit('removeGoal', {
        id: props.id,
        category: storeCategories.PERSONAL,
      });
      router.push('/');
    });
    onErrorDelete((e) => {
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });
    return {
      personalGoal,
      deleteBucketListItem,
      updatePersonalBucketListItem,
      placeholders,
      title,
      about,
      areaOfLife,
      desiredGoal,
      reasonForGoal,
      desiredCompletionDate,
      completed,
      completedOnTime,
      state,
      setToEditMode,
      exitEditMode,
    };
  },
};
</script>

<style></style>
