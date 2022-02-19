<template>
  <div>
    <div v-if="category === 'Travel'">
      <TravelGoalCard :id="id" />
    </div>
    <div v-if="category === 'Education'">
      <EducationalGoalCard :id="id" />
    </div>
    <div v-if="category === 'Personal'">
      <PersonalGoalCard :id="id" />
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
  props: {
    category: String,
    id: String,
  },
  data() {
    return {
      // idFromParam: this.$route.params.id,
      // data: this.$route.params.data,
    };
  },
};
</script>

<style></style>
