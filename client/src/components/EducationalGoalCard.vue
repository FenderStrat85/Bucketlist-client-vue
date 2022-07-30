<template>
  <div>
    <div v-if="!state.isInEditMode">
      <h1>{{ educationalGoal.category }} Card</h1>
      <h2>The title is: {{ educationalGoal.title }}</h2>
      <h2>Completed? {{ educationalGoal.completed }}</h2>
      <h2>About: {{ educationalGoal.about }}</h2>
      <button @click="deleteBucketListItem()">Delete Goal</button>
      <button @click="setToEditMode()">Edit your goal</button>
      <div v-if="state.showErrorMessage">
        <h2>There has been an error deleting this item</h2>
      </div>
    </div>
    <div v-if="state.isInEditMode">
      <h1>I am the Educational Goal Form</h1>
      <form @submit.prevent="editEducationalBucketListItem()">
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
        <label for="subject">Subject: </label>
        <textarea
          type="text"
          name="subject"
          v-model="subject"
          :placeholder="placeholders.subject"
          required
        />
        <label for="desiredGoal">Desired Goal: </label>
        <textarea
          type="text"
          name="desiredGoal"
          v-model="desiredGoal"
          :placeholder="placeholders.desiredGoal"
          required
        />
        <label for="reasonForLearning">Reason For Learning: </label>
        <textarea
          type="text"
          name="reasonForLearning"
          v-model="reasonForLearning"
          :placeholder="placeholders.reasonForLearning"
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
import { reactive, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
export default {
  props: {
    id: String,
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false,
      isInEditMode: false,
    });
    const educationalGoal = store.getters.getEducationById(props.id);

    const placeholders = {
      title: educationalGoal.title,
      about: educationalGoal.about,
      subject: educationalGoal.subject,
      desiredGoal: educationalGoal.desiredGoal,
      reasonForLearning: educationalGoal.reasonForLearning,
      desiredCompletionDate: educationalGoal.desiredCompletionDate,
      completed: educationalGoal.completed,
      completedOnTime: educationalGoal.completedOnTime,
    };

    const title = ref(educationalGoal.title);
    const about = ref(educationalGoal.about);
    const subject = ref(educationalGoal.subject);
    const desiredGoal = ref(educationalGoal.desiredGoal);
    const reasonForLearning = ref(educationalGoal.reasonForLearning);
    const desiredCompletionDate = ref(educationalGoal.desiredCompletionDate);
    const completed = ref(educationalGoal.completed);
    const completedOnTime = ref(educationalGoal.completedOnTime);

    const setToEditMode = () => (state.isInEditMode = true);
    const exitEditMode = () => (state.isInEditMode = false);
    const editEducationalBucketListItem = () => {
      console.log('submitted');
    };
    const {
      mutate: deleteBucketListItem,
      onDone,
      onError,
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
            category: educationalGoal.category,
          },
        },
      }),
    );
    onDone((result) => {
      console.log(result);
      store.commit('removeEducationalGoal', props.id);
      router.push('/');
    });
    onError((e) => {
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });
    return {
      educationalGoal,
      deleteBucketListItem,
      setToEditMode,
      exitEditMode,
      editEducationalBucketListItem,
      title,
      about,
      subject,
      desiredGoal,
      reasonForLearning,
      desiredCompletionDate,
      completed,
      completedOnTime,
      placeholders,
      state,
    };
  },
};
</script>

<style></style>
