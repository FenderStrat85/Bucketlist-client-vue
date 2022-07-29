<template>
  <div>
    <h1>{{ educationalGoal.category }} Card</h1>
    <h2>The title is: {{ educationalGoal.title }}</h2>
    <h2>Completed? {{ educationalGoal.completed }}</h2>
    <h2>About: {{ educationalGoal.about }}</h2>
    <button @click="deleteBucketListItem()">Delete Goal</button>
    <div v-if="state.showErrorMessage">
      <h2>There has been an error deleting this item</h2>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive } from 'vue';
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
    });
    const educationalGoal = store.getters.getEducationById(props.id);
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
      state,
    };
  },
};
</script>

<style></style>
