<template>
  <div>
    <div v-if="category === 'Travel'">
      <h1>I am the the {{ category }} detail</h1>
      <p>The items id is {{ id }}</p>
      <p>The items category is {{ category }}</p>
      <p>The items title is {{ title }}</p>
    </div>
    <div v-if="category === 'Education'">
      <h1>I am the the {{ category }} detail</h1>
      <p>The items id is {{ id }}</p>
      <p>The items category is {{ category }}</p>
      <p>The items title is {{ title }}</p>
    </div>
    <div v-if="category === 'Personal'">
      <PersonalGoalCard :category="category" :title="title" />
    </div>
  </div>
</template>

<script>
import PersonalGoalCard from '../../components/PersonalGoalCard.vue';
// import TravelGoalCard from '../../components/TravelGoalCard.vue';
// import EducationalGoalCard from '../../components/EducationalGoalCard.vue';
//passing the id through props as opposed to route params
//passed as params in router link but then accessed as props
export default {
  components: { PersonalGoalCard },
  props: ['id', 'title', 'category'],
  data() {
    return {
      // idFromParam: this.$route.params.id,
    };
  },
};
</script>

<style></style>
