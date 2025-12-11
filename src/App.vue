<!-- src/App.vue -->
<template>
  <div class="app">
    <header class="header">
      <h1>Gestion de stocks</h1>

      <nav class="nav">
        <RouterLink to="/produits">Produits</RouterLink>
        <RouterLink to="/categories">Catégories</RouterLink>
        <RouterLink to="/clients">Clients</RouterLink>
      </nav>
    </header>

    <main class="main">
      <!-- ici s’affichent ProductsView, CategoriesView, ClientsView -->
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  text-decoration: none;
}

.main {
  padding: 1rem;
}
</style>
