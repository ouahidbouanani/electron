import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/dashboard" },

  // Public
  { path: "/login", component: () => import("../views/LoginView.vue"), meta: { public: true } },
  { path: "/register", component: () => import("../views/RegisterView.vue"), meta: { public: true } },

  // App
  { path: "/dashboard", component: () => import("../views/DashboardView.vue") },
  { path: "/produits", component: () => import("../views/ProductsView.vue") },
  { path: "/categories", component: () => import("../views/CategoriesView.vue") },
  { path: "/clients", component: () => import("../views/ClientsView.vue") },
  { path: "/fournisseurs", component: () => import("../views/SuppliersView.vue") },
  { path: "/commandes", component: () => import("../views/OrdersView.vue") },
  { path: "/livraisons", component: () => import("../views/ShipmentsView.vue") },
  { path: "/factures", component: () => import("../views/InvoicesView.vue") },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

let hydrated = false;

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // hydrate session once
  if (!hydrated) {
    hydrated = true;
    await auth.hydrate();
  }

  const isPublic = Boolean(to.meta.public);

  if (!isPublic && !auth.user) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (isPublic && auth.user && (to.path === "/login" || to.path === "/register")) {
    return { path: "/dashboard" };
  }

  return true;
});

export default router;
