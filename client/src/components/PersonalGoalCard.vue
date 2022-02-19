<template>
  <div>
    <h1>{{ personalGoal.category }} Card</h1>
    <h2>The title is: {{ personalGoal.title }}</h2>
    <h2>Completed? {{ personalGoal.completed }}</h2>
    <h2>About: {{ personalGoal.about }}</h2>
  </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();
    const personalGoal = store.getters.getPersonalById(props.id);
    return {
      personalGoal,
    };
  },
};
</script>

<style></style>
