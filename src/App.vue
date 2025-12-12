<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h1 class="logo">StockApp</h1>

      <nav class="nav">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/produits">Produits</RouterLink>
        <RouterLink to="/categories">Catégories</RouterLink>
        <RouterLink to="/clients">Clients</RouterLink>
        <RouterLink to="/fournisseurs">Fournisseurs</RouterLink>
        <RouterLink to="/commandes">Commandes</RouterLink>
        <RouterLink to="/livraisons">Livraisons</RouterLink>

      </nav>
    </aside>

    <!-- Contenu principal -->
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>

.layout {
  display: flex;
  height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.sidebar {
  width: 240px;
  background-color: #1e3a8a; 
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.nav a:hover {
  background-color: #1d4ed8;
}

.nav a.router-link-active {
  background-color: #2563eb;
}

.main {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f9fafb;
}
</style>
