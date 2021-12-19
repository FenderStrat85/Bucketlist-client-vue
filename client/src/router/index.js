import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import NotFound from '../views/NotFound.vue';
import Items from '../views/items/Items.vue';
import ItemDetails from '../views/items/ItemDetails.vue';
//within router to access store you need to import from @/store.
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/items',
    name: 'Items',
    component: Items,
  },
  {
    path: '/items/:id',
    name: 'ItemDetails',
    component: ItemDetails,
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//before entering each route, if not login/signup then redirect to login page.
router.beforeEach((to, from, next) => {
  if (
    to.name !== 'Login' &&
    to.name !== 'Signup' &&
    !store.state.isAuthenticated
  ) {
    console.log(store.state);
    next({ name: 'Login' });
  } else next();
});

export default router;
