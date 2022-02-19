<template>
  <div>
    <h1>{{ educationalGoal.category }} Card</h1>
    <h2>The title is: {{ educationalGoal.title }}</h2>
    <h2>Completed? {{ educationalGoal.completed }}</h2>
    <h2>About: {{ educationalGoal.about }}</h2>
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
    const educationalGoal = store.getters.getEducationById(props.id);
    return {
      educationalGoal,
    };
  },
};
</script>

<style></style>
