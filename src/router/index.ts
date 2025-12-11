// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';

import ProductsView from '../views/ProductsView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import ClientsView from '../views/ClientsView.vue';
// importe d'autres vues si besoin

const routes = [
  { path: '/', redirect: '/produits' },
  { path: '/produits', component: ProductsView },
  { path: '/categories', component: CategoriesView },
  { path: '/clients', component: ClientsView },
  // { path: '/commandes', component: OrdersView },
];

const router = createRouter({
  history: createWebHashHistory(), 
  routes,
});

export default router;
