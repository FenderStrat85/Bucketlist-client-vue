<template>
  <div>
    <h1>Goal details!!!!</h1>
    <h2>{{ this.category }}</h2>
    <h2>{{ this.id }}</h2>
    <div v-if="this.category === 'travel'">
      <TravelGoalCard :id="this.id" />
    </div>
    <div v-if="this.category === 'education'">
      <EducationalGoalCard :id="this.id" />
    </div>
    <div v-if="this.category === 'personal'">
      <PersonalGoalCard :id="this.id" />
    </div>
  </div>
</template>

<script>
import PersonalGoalCard from '../../components/PersonalGoalCard.vue';
import EducationalGoalCard from '../../components/EducationalGoalCard.vue';
import TravelGoalCard from '../../components/TravelGoalCard.vue';
import { useRoute } from 'vue-router';

export default {
  components: { PersonalGoalCard, EducationalGoalCard, TravelGoalCard },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const category = route.params.category;
    console.log('route', route.params);
    console.log('id', id);
    console.log('category', category);
    return {
      category,
      id,
      PersonalGoalCard,
      TravelGoalCard,
      EducationalGoalCard,
    };
  },
};
</script>

<style></style>
