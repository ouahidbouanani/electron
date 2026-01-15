<template>
  <!-- Public pages (login/register) -->
  <RouterView v-if="isPublic" />

  <!-- App shell -->
  <div v-else class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-blue-900 text-white flex flex-col">
      <div class="px-6 py-5">
        <img src="./assets/stockMaster_sansBG.png" alt="StockApp Logo" class="h-28" />
      </div>
      <nav class="flex-1 px-2 space-y-1">
        <RouterLink to="/dashboard"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <Squares2X2Icon class="w-5 h-5" />
          Dashboard
        </RouterLink>

        <RouterLink to="/produits"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <CubeIcon class="w-5 h-5" />
          Produits
        </RouterLink>

        <RouterLink to="/categories"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <TagIcon class="w-5 h-5" />
          Catégories
        </RouterLink>

        <RouterLink to="/clients"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <UsersIcon class="w-5 h-5" />
          Clients
        </RouterLink>

        <RouterLink to="/fournisseurs"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <TruckIcon class="w-5 h-5" />
          Fournisseurs
        </RouterLink>

        <RouterLink to="/commandes"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <ShoppingCartIcon class="w-5 h-5" />
          Commandes
        </RouterLink>


        <RouterLink to="/factures"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <DocumentTextIcon class="w-5 h-5" />
          Factures
        </RouterLink>

        <RouterLink to="/livraisons"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white">
          <ClipboardDocumentListIcon class="w-5 h-5" />
          Livraisons
        </RouterLink>
      </nav>

      <div class="px-4 pb-4">
        <div class="text-xs text-blue-200 mb-2">
          Connecté: <span class="font-semibold text-white">{{ auth.user?.nom }}</span>
          <span class="text-blue-300">({{ auth.user?.email }})</span>
        </div>

        <button class="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md px-4 py-2 font-medium"
          @click="onLogout">
          Se déconnecter
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "./stores/authStore";
import { DocumentTextIcon } from "@heroicons/vue/24/outline";

import {
  Squares2X2Icon,
  CubeIcon,
  TagIcon,
  UsersIcon,
  TruckIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isPublic = computed(() => Boolean(route.meta.public));

async function onLogout() {
  await auth.logout();
  router.push("/login");
}
</script>
