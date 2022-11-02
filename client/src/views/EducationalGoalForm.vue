<template>
  <div>
    <h1>I am the Educational Goal Form</h1>
    <form @submit.prevent="addEducationalBucketListItem()">
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
      <Datepicker
        v-model="desiredCompletionDate"
        placeholder="Start Typing ..."
        textInput
        :minDate="new Date()"
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
import { goalFormPlaceholders } from '../constants/formPlaceholders';
import { categories, storeCategories } from '../constants/categories';
import { logErrorMessages } from '@vue/apollo-util';
import { useStore } from 'vuex';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import { toastOptions } from '../constants/toastOptions';
import { useToast } from 'vue-toast-notification';

export default {
  components: {
    Datepicker,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false,
    });
    const placeholders = goalFormPlaceholders;
    const toast = useToast();

    const title = ref('');
    const about = ref('');
    const subject = ref('');
    const desiredGoal = ref('');
    const reasonForLearning = ref('');
    const desiredCompletionDate = ref('');
    const completed = ref(false);
    const completedOnTime = ref(false);

    const {
      mutate: addEducationalBucketListItem,
      onDone,
      onError,
    } = useMutation(
      gql`
        mutation addEducationalBucketListItem(
          $educationalItemInput: EducationalBucketListInput
        ) {
          addEducationalBucketListItem(
            educationalItemInput: $educationalItemInput
          ) {
            _id
            userId
            category
            title
            about
            subject
            desiredGoal
            reasonForLearning
            desiredCompletionDate
            completed
            completedOnTime
          }
        }
      `,
      () => ({
        variables: {
          educationalItemInput: {
            category: categories.EDUCATIONAL,
            title: title.value,
            about: about.value,
            subject: subject.value,
            desiredGoal: desiredGoal.value,
            reasonForLearning: reasonForLearning.value,
            desiredCompletionDate: desiredCompletionDate.value,
            completed: completed.value,
            completedOnTime: completedOnTime.value,
          },
        },
      }),
    );
    onDone((result) => {
      toast.success('Educational goal successfully added', toastOptions);
      store.commit('addGoal', {
        category: storeCategories.EDUCATIONAL,
        data: result.data.addEducationalBucketListItem,
      });
      router.push('/');
    });
    onError((e) => {
      logErrorMessages(e);
      // shows the full error from graphql
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });
    return {
      placeholders,
      title,
      about,
      subject,
      desiredGoal,
      reasonForLearning,
      desiredCompletionDate,
      completed,
      completedOnTime,
      addEducationalBucketListItem,
      state,
      Datepicker,
    };
  },
};
</script>

<style></style>
