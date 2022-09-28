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
//passing the id through props as opposed to route params
//passed as params in router link but then accessed as props
import { useRoute } from 'vue-router';
export default {
  components: { PersonalGoalCard, EducationalGoalCard, TravelGoalCard },
  // props: {
  //   category: String,
  //   id: String,
  // },
  // computed() {
  //   return {
  //     category: this.$route.params.category,
  //     id: this.$route.params.id,
  //   };
  // },
  setup() {
    // const params = this.$route.params.id;
    // console.log(params);
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
