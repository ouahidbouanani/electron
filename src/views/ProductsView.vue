<template>
  <div class="p-6">

    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      Gestion de stocks - Produits
    </h1>

    <!-- Formulaire d'ajout / édition -->
    <form @submit.prevent="onSubmit" class="flex gap-3 mb-6 items-end">
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">Nom du produit</label>
        <input
          v-model="nom"
          placeholder="Nom du produit"
          class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Prix</label>
        <input
          v-model.number="prix"
          type="number"
          step="0.01"
          placeholder="Prix"
          class="border border-gray-300 rounded px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Quantité</label>
        <input
          v-model.number="quantite"
          type="number"
          placeholder="Quantité"
          class="border border-gray-300 rounded px-3 py-2 w-28 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        :disabled="!isFormValid"
        :class="[
          'px-4 py-2 rounded transition',
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
        class="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
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

    <!-- Tableau des produits -->
    <table class="w-full border border-gray-300 text-left text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="border border-gray-300 px-2 py-2">ID</th>
          <th class="border border-gray-300 px-2 py-2">Nom</th>
          <th class="border border-gray-300 px-2 py-2">Prix</th>
          <th class="border border-gray-300 px-2 py-2">Quantité</th>
          <th class="border border-gray-300 px-2 py-2 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="p in produits"
          :key="p.id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="border border-gray-300 px-2 py-2">{{ p.id }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ p.nom }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ p.prix }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ p.quantite }}</td>
          <td class="border border-gray-300 px-2 py-2 text-center space-x-2">
            <button
              @click="startEdit(p)"
              class="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Modifier
            </button>
            <button
              @click="remove(p.id!)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
import { useStockStore, type Produit } from '../stores/stockStore';

const store = useStockStore();
const { produits } = storeToRefs(store);

const nom = ref('');
const prix = ref(0);
const quantite = ref(0);
const editingId = ref<number | null>(null); // null = mode ajout, sinon = id en édition

const load = () => store.loadProduits();

const isFormValid = computed(() =>
  nom.value.trim().length > 0 && prix.value > 0 && quantite.value > 0
);

const resetForm = () => {
  nom.value = '';
  prix.value = 0;
  quantite.value = 0;
  editingId.value = null;
};

const onSubmit = async () => {
  if (!isFormValid.value) return;

  if (editingId.value === null) {
    // mode AJOUT
    await store.addProduit({
      nom: nom.value,
      prix: prix.value,
      quantite: quantite.value,
      category_id: null,
    });
  } else {
    // mode UPDATE
    await store.updateProduit({
      id: editingId.value,
      nom: nom.value,
      prix: prix.value,
      quantite: quantite.value,
      category_id: null,
    });
  }

  resetForm();
};

const startEdit = (p: Produit) => {
  if (!p.id) return;
  editingId.value = p.id;
  nom.value = p.nom;
  prix.value = p.prix;
  quantite.value = p.quantite;
};

const remove = async (id: number) => {
  await store.deleteProduit(id);
};

onMounted(load);
</script>
