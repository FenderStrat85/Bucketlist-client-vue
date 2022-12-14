<template>
  <div>
    <Transition name="flip" mode="out-in">
      <div v-if="!state.isInEditMode">
        <h1>{{ educationalGoal.category }} Goal!</h1>
        <h2>Goal title: {{ educationalGoal.title }}</h2>
        <h2>About: {{ educationalGoal.about }}</h2>
        <h2>Subject: {{ educationalGoal.subject }}</h2>
        <h2>Desired Goal: {{ educationalGoal.desiredGoal }}</h2>
        <h2>Reason For Learning: {{ educationalGoal.reasonForLearning }}</h2>
        <h2>Completed? : {{ educationalGoal.completed }}</h2>
        <div class="datepicker-container">
          <h2>Date to finish:</h2>
          <Datepicker
            class="datepicker"
            v-model="desiredCompletionDate"
            autoApply
            :format="format"
          />
        </div>
        <button
          class="button-login button-delete"
          @click="deleteBucketListItem()"
        >
          Delete Goal
        </button>
        <div v-if="state.showErrorMessage">
          <h2>There has been an error deleting this item</h2>
        </div>
        <button
          class="button-login button-educational"
          @click="setToEditMode()"
        >
          Edit your goal
        </button>
      </div>
      <div v-else>
        <h1>Edit your goal</h1>
        <form @submit.prevent="updateEducationalBucketListItem()">
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
            <label for="subject">Subject: </label>
            <input
              class="form-input"
              type="text"
              name="subject"
              v-model="subject"
              :placeholder="placeholders.subject"
              required
            />
            <label for="desiredGoal">Desired Goal: </label>
            <textarea
              type="text"
              class="form-textarea"
              rows="5"
              name="desiredGoal"
              v-model="desiredGoal"
              :placeholder="placeholders.desiredGoal"
              required
            />
            <label for="reasonForLearning">Reason For Learning: </label>
            <textarea
              type="text"
              class="form-textarea"
              rows="5"
              name="reasonForLearning"
              v-model="reasonForLearning"
              :placeholder="placeholders.reasonForLearning"
              required
            />
            <label for="desiredCompletionDate">Desired completion date: </label>
            <Datepicker
              v-model="desiredCompletionDate"
              placeholder="placeholders.desiredCompletionDate"
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
            <button class="button-login button-educational">Submit</button>
          </div>
        </form>
        <button class="button-login button-go-back" @click="exitEditMode()">
          Return to Goal
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
import { categories, storeCategories } from '../constants/categories';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import { toastOptions } from '../constants/toastOptions';
import { useToast } from 'vue-toast-notification';

export default {
  props: {
    id: String
  },
  components: {
    Datepicker
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      showErrorMessage: false,
      isInEditMode: false
    });
    const educationalGoal = store.getters.getEducationById(props.id);
    const toast = useToast();

    const placeholders = {
      title: educationalGoal.title,
      about: educationalGoal.about,
      subject: educationalGoal.subject,
      desiredGoal: educationalGoal.desiredGoal,
      reasonForLearning: educationalGoal.reasonForLearning,
      desiredCompletionDate: educationalGoal.desiredCompletionDate,
      completed: educationalGoal.completed,
      completedOnTime: educationalGoal.completedOnTime
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

    const format = () => {
      const date = new Date(educationalGoal.desiredCompletionDate);
      return `You want to complete this goal by: ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
    };

    const {
      mutate: updateEducationalBucketListItem,
      onDone: onDoneUpdate,
      onError: onErrorUpdate
    } = useMutation(
      gql`
        mutation updateEducationalBucketListItem(
          $educationalItemInput: EducationalBucketListInput
        ) {
          updateEducationalBucketListItem(
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
            _id: educationalGoal._id,
            category: categories.EDUCATIONAL,
            title: title.value,
            about: about.value,
            subject: subject.value,
            desiredGoal: desiredGoal.value,
            reasonForLearning: reasonForLearning.value,
            desiredCompletionDate: desiredCompletionDate.value,
            completed: completed.value,
            completedOnTime: completedOnTime.value
          }
        }
      })
    );
    onDoneUpdate((result) => {
      toast.success('Educational goal updated successfully', toastOptions);
      store.commit('updateGoal', {
        data: result.data.updateEducationalBucketListItem,
        category: storeCategories.EDUCATIONAL
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
      onError: onErrorDelete
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
            category: educationalGoal.category
          }
        }
      })
    );
    onDoneDelete(() => {
      store.commit('removeGoal', {
        id: props.id,
        category: storeCategories.EDUCATIONAL
      });
      router.push('/');
    });
    onErrorDelete((e) => {
      console.error(e);
      state.showErrorMessage = true;
    });
    return {
      educationalGoal,
      deleteBucketListItem,
      setToEditMode,
      exitEditMode,
      updateEducationalBucketListItem,
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
      Datepicker,
      format
    };
  }
};
</script>

<style>
.flip-enter-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  transform-origin: 50% 50%;
}
.flip-leave-active {
  transform-origin: 50% 50%;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.flip-enter-from,
.flip-leave-to {
  transform-origin: 50% 50%;
  transform: scaleY(0) translateZ(0);
  opacity: 0;
}
</style>
