import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import NotFound from '../views/NotFound.vue';
import Goals from '../views/goals/Goals.vue';
import GoalDetails from '../views/goals/GoalDetails.vue';
import PersonalGoalForm from '../views/PersonalGoalForm.vue';
import EducationalGoalForm from '../views/EducationalGoalForm';
import TravelGoalForm from '../views/TravelGoalForm';

//within router to access store you need to import from @/store.
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/addpersonalgoal',
    name: 'PersonalGoalForm',
    component: PersonalGoalForm
  },
  {
    path: '/addeducationalgoal',
    name: 'EducationalGoalForm',
    component: EducationalGoalForm
  },
  {
    path: '/addtravelgoal',
    name: 'TravelGoalForm',
    component: TravelGoalForm
  },
  {
    path: '/goals',
    name: 'Goals',
    component: Goals
  },
  {
    path: '/goals/:category/:id',
    name: 'GoalDetails',
    component: GoalDetails,
    props: true
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

//before entering each route, if not login/signup then redirect to login page.
router.beforeEach((to, from, next) => {
  if (
    to.name !== 'Login' &&
    to.name !== 'Signup' &&
    !store.state.isAuthenticated
  ) {
    next({ name: 'Login' });
  } else next();
});

export default router;
