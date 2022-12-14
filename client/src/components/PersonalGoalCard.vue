<template>
  <div>
    <Transition name="flip" mode="out-in">
      <div v-if="!state.isInEditMode">
        <h1>{{ personalGoal.category }} Goal</h1>
        <h2>Goal title: {{ personalGoal.title }}</h2>
        <h2>About: {{ personalGoal.about }}</h2>
        <h2>Area of life: {{ personalGoal.areaOfLife }}</h2>
        <h2>Desired goal: {{ personalGoal.desiredGoal }}</h2>
        <h2>Reason for goal: {{ personalGoal.reasonForGoal }}</h2>
        <h2>Completed? {{ personalGoal.completed }}</h2>
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
        <button class="button-login button-personal" @click="setToEditMode()">
          Edit your goal
        </button>
      </div>
      <div v-else>
        <h1>Edit your goal</h1>
        <form @submit.prevent="updatePersonalBucketListItem()">
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
              class="form-textarea"
              rows="5"
              type="text"
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
            <textarea
              type="text"
              class="form-textarea"
              rows="5"
              name="desiredGoal"
              v-model="desiredGoal"
              :placeholder="placeholders.desiredGoal"
              required
            />
            <label for="reasonForGoal">Reason for your goal: </label>
            <textarea
              type="text"
              name="reasonForGoal"
              class="form-textarea"
              rows="5"
              v-model="reasonForGoal"
              :placeholder="placeholders.reasonForGoal"
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
            <button class="button-login button-personal">Submit</button>
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
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { reactive, ref } from 'vue';
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
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      showErrorMessage: false,
      isInEditMode: false
    });
    const personalGoal = store.getters.getPersonalById(props.id);
    const toast = useToast();

    const placeholders = {
      title: personalGoal.title,
      about: personalGoal.about,
      areaOfLife: personalGoal.areaOfLife,
      desiredGoal: personalGoal.desiredGoal,
      reasonForGoal: personalGoal.reasonForGoal,
      desiredCompletionDate: personalGoal.desiredCompletionDate,
      completed: personalGoal.completed,
      completedOnTime: personalGoal.completedOnTime
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

    const format = () => {
      const date = new Date(personalGoal.desiredCompletionDate);
      return `You want to complete this goal by: ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
    };

    const {
      mutate: updatePersonalBucketListItem,
      onDone: onDoneUpdate,
      onError: onErrorUpdate
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
            completedOnTime: completedOnTime.value
          }
        }
      })
    );
    onDoneUpdate((result) => {
      toast.success('Personal goal updated successfully', toastOptions);
      store.commit('updateGoal', {
        data: result.data.updatePersonalBucketListItem,
        category: storeCategories.PERSONAL
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
            category: personalGoal.category
          }
        }
      })
    );
    onDoneDelete(() => {
      store.commit('removeGoal', {
        id: props.id,
        category: storeCategories.PERSONAL
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
