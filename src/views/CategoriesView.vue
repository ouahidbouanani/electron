<template>
  <div style="padding: 1rem;">
    <h1>Gestion de stocks - Catégories</h1>

    <form @submit.prevent="onAdd" style="margin-bottom: 1rem;">
      <input v-model="nom" placeholder="Nom de la catégorie" />
      <button type="submit">Ajouter</button>
    </form>

    <button @click="load">Recharger</button>

    <table border="1" cellpadding="5" cellspacing="0" style="margin-top: 1rem;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.nom }}</td>
          <td>
            <button @click="onEdit(c)">Renommer</button>
            <button @click="remove(c.id!)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore, type Category } from '../stores/categoryStore';

const store = useCategoryStore();
const { categories } = storeToRefs(store);

const nom = ref('');

const load = () => store.loadCategories();

const onAdd = async () => {
  if (!nom.value.trim()) return;
  await store.addCategory({ nom: nom.value.trim() });
  nom.value = '';
};

const onEdit = async (category: Category) => {
  const nouveauNom = window.prompt('Nouveau nom de la catégorie :', category.nom);
  if (!nouveauNom || !nouveauNom.trim() || nouveauNom === category.nom) return;

  await store.updateCategory({
    ...category,
    nom: nouveauNom.trim(),
  });
};

const remove = async (id: number) => {
  if (!confirm('Supprimer cette catégorie ?')) return;
  await store.deleteCategory(id);
};

onMounted(load);
</script>
