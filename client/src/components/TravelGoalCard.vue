<template>
  <div>
    <h1>{{ travelGoal.category }} Card</h1>
    <h2>The title is: {{ travelGoal.title }}</h2>
    <h2>Completed? {{ travelGoal.completed }}</h2>
    <h2>About: {{ travelGoal.about }}</h2>
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
    const travelGoal = store.getters.getTravelById(props.id);
    return {
      travelGoal,
    };
  },
};
</script>

<style></style>
