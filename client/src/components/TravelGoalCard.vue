<template>
  <div>
    <div v-if="!state.isInEditMode">
      <div>
        <h1>{{ travelGoal.category }} Card</h1>
        <h2>The title is: {{ travelGoal.title }}</h2>
        <h2>Completed? {{ travelGoal.completed }}</h2>
        <h2>About: {{ travelGoal.about }}</h2>
      </div>
      <button @click="deleteBucketListItem()">Delete Goal</button>
      <div v-if="state.showErrorMessage">
        <h2>There has been an error deleting this item</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { storeCategories } from '../constants/categories';
import { useRouter } from 'vue-router';

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
    const travelGoal = store.getters.getTravelById(props.id);

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
            category: travelGoal.category,
          },
        },
      }),
    );
    onDoneDelete((result) => {
      console.log('result', result);
      store.commit('removeGoal', {
        id: props.id,
        category: storeCategories.TRAVEL,
      });
      router.push('/');
    });
    onErrorDelete((e) => {
      console.error(e);
      state.showErrorMessage = true;
    });

    return {
      travelGoal,
      state,
      deleteBucketListItem,
    };
  },
};
</script>

<style></style>
