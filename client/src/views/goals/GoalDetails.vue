<template>
  <div>
    <div v-if="category === 'Travel'">
      <TravelGoalCard :category="category" :title="title" />
    </div>
    <div v-if="category === 'Education'">
      <EducationalGoalCard :category="category" :title="title" />
    </div>
    <div v-if="category === 'Personal'">
      <PersonalGoalCard :category="category" :title="title" />
    </div>
  </div>
</template>

<script>
import PersonalGoalCard from '../../components/PersonalGoalCard.vue';
import EducationalGoalCard from '../../components/EducationalGoalCard.vue';
import TravelGoalCard from '../../components/TravelGoalCard.vue';
//passing the id through props as opposed to route params
//passed as params in router link but then accessed as props
export default {
  components: { PersonalGoalCard, EducationalGoalCard, TravelGoalCard },
  props: ['id', 'title', 'category'],
  data() {
    return {
      // idFromParam: this.$route.params.id,
    };
  },
};
</script>

<style></style>
