<template>
  <div>
    <h1>{{ personalGoal.category }} Card</h1>
    <h2>The title is: {{ personalGoal.title }}</h2>
    <h2>Completed? {{ personalGoal.completed }}</h2>
    <h2>About: {{ personalGoal.about }}</h2>
    <button @click="deleteBucketListItem()">Delete Goal</button>
    <div v-if="state.showErrorMessage">
      <h2>There has been an error deleting this item</h2>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
export default {
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const personalGoal = store.getters.getPersonalById(props.id);
    const state = reactive({
      showErrorMessage: false,
      isInEditMode: false,
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
      store.commit('removePersonalGoal', props.id);
      router.push('/');
    });
    onErrorDelete((e) => {
      console.log(JSON.stringify(e, null, 2));
      state.showErrorMessage = true;
    });
    return {
      personalGoal,
      deleteBucketListItem,
    };
  },
};
</script>

<style></style>
