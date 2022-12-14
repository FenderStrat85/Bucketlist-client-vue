<template>
  <div>
    <h1>Add a personal goal</h1>
    <form @submit.prevent="addPersonalBucketListItem()">
      <div class="form-container">
        <label for="title">Title: </label>
        <input
          class="form-input"
          type="text"
          name="title"
          v-model="title"
          :placeholder="placeholders.title"
          required
        />
        <label for="about">About: </label>
        <textarea
          type="text"
          class="form-textarea"
          rows="5"
          name="about"
          v-model="about"
          :placeholder="placeholders.about"
          required
        />
        <label for="areaOfLife">Area of life: </label>
        <textarea
          type="text"
          class="form-textarea"
          rows="5"
          name="areaOfLife"
          v-model="areaOfLife"
          :placeholder="placeholders.areaOfLife"
          required
        />
        <label for="desiredGoal">Desired goal: </label>
        <input
          class="form-input"
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
          class="form-textarea"
          rows="5"
          type="text"
          name="reasonForGoal"
          v-model="reasonForGoal"
          :placeholder="placeholders.reasonForGoal"
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
        <div class="form-radio-container">
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
        </div>
        <div v-if="completed">
          <div class="form-radio-container">
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
        </div>
        <button class="button-login button-personal">Submit</button>
      </div>
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
    Datepicker
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false
    });

    const placeholders = goalFormPlaceholders;
    const toast = useToast();

    const title = ref('');
    const about = ref('');
    const areaOfLife = ref('');
    const desiredGoal = ref('');
    const reasonForGoal = ref('');
    const desiredCompletionDate = ref();
    const completed = ref(false);
    const completedOnTime = ref(false);

    const {
      mutate: addPersonalBucketListItem,
      onDone,
      onError
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
            completedOnTime: completedOnTime.value
          }
        }
      })
    );
    onDone((result) => {
      toast.success('Your personal goal has been added!', toastOptions);
      store.commit('addGoal', {
        category: storeCategories.PERSONAL,
        data: result.data.addPersonalBucketListItem
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
      Datepicker
    };
  }
};
</script>

<style></style>
