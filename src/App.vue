<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-blue-900 text-white flex flex-col">
      <div class="px-6 py-5 text-2xl font-bold">
        StockApp
      </div>

      <nav class="flex-1 px-2 space-y-1">
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <Squares2X2Icon class="w-5 h-5" />
          Dashboard
        </RouterLink>

        <RouterLink
          to="/produits"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <CubeIcon class="w-5 h-5" />
          Produits
        </RouterLink>

        <RouterLink
          to="/categories"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <TagIcon class="w-5 h-5" />
          Catégories
        </RouterLink>

        <RouterLink
          to="/clients"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <UsersIcon class="w-5 h-5" />
          Clients
        </RouterLink>

        <RouterLink
          to="/fournisseurs"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <TruckIcon class="w-5 h-5" />
          Fournisseurs
        </RouterLink>

        <RouterLink
          to="/commandes"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <ShoppingCartIcon class="w-5 h-5" />
          Commandes
        </RouterLink>

        <RouterLink
          to="/livraisons"
          class="flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-blue-700 hover:text-white transition"
          active-class="bg-blue-600 text-white"
        >
          <ClipboardDocumentListIcon class="w-5 h-5" />
          Livraisons
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import {
  Squares2X2Icon,
  CubeIcon,
  TagIcon,
  UsersIcon,
  TruckIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'
</script>
