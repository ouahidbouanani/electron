<template>
  <div class="p-6">

    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      Gestion de stocks - Catégories
    </h1>

    <!-- Formulaire d'ajout / édition -->
    <form @submit.prevent="onSubmit" class="flex gap-3 mb-6 items-end">
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">Nom de la catégorie</label>
        <input
          v-model="nom"
          placeholder="Nom de la catégorie"
          class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        :disabled="!isFormValid"
        :class="[
          'px-4 py-2 rounded text-sm font-medium transition',
          isFormValid
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        {{ editingId ? 'Mettre à jour' : 'Ajouter' }}
      </button>

      <button
        v-if="editingId"
        type="button"
        @click="resetForm"
        class="px-3 py-2 rounded border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
      >
        Annuler
      </button>
    </form>

    <!-- Bouton Recharger -->
    <button
      @click="load"
      class="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
    >
      Recharger
    </button>

    <!-- Tableau des catégories -->
    <table class="w-full border border-gray-300 text-left text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="border border-gray-300 px-2 py-2">ID</th>
          <th class="border border-gray-300 px-2 py-2">Nom</th>
          <th class="border border-gray-300 px-2 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in categories"
          :key="c.id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="border border-gray-300 px-2 py-2">{{ c.id }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ c.nom }}</td>
          <td class="border border-gray-300 px-2 py-2 text-center space-x-2">
            <button
              @click="startEdit(c)"
              class="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition text-xs"
            >
              Renommer
            </button>
            <button
              @click="remove(c.id!)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore, type Category } from '../stores/categoryStore';

const store = useCategoryStore();
const { categories } = storeToRefs(store);

const nom = ref('');
const editingId = ref<number | null>(null); // null = ajout, sinon édition

const load = () => store.loadCategories();

const isFormValid = computed(() => nom.value.trim().length > 0);

const resetForm = () => {
  nom.value = '';
  editingId.value = null;
};

const onSubmit = async () => {
  if (!isFormValid.value) return;

  if (editingId.value === null) {
    // AJOUT
    await store.addCategory({ nom: nom.value.trim() });
  } else {
    // UPDATE
    await store.updateCategory({
      id: editingId.value,
      nom: nom.value.trim(),
    });
  }

  resetForm();
};

const startEdit = (category: Category) => {
  if (!category.id) return;
  editingId.value = category.id;
  nom.value = category.nom;
};

const remove = async (id: number) => {
  if (!confirm('Supprimer cette catégorie ?')) return;
  await store.deleteCategory(id);
};

onMounted(load);
</script>
