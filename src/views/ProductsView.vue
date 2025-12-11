<!-- src/views/ProductsView.vue -->
<template>
  <div style="padding: 1rem;">
    <h1>Gestion de stocks - Produits</h1>

    <form @submit.prevent="onAdd" style="margin-bottom: 1rem;">
      <input v-model="nom" placeholder="Nom du produit" />
      <input v-model.number="prix" type="number" step="0.01" placeholder="Prix" />
      <input v-model.number="quantite" type="number" placeholder="Quantité" />
      <button type="submit">Ajouter</button>
    </form>

    <button @click="load">Recharger</button>

    <table border="1" cellpadding="5" cellspacing="0" style="margin-top: 1rem;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prix</th>
          <th>Quantité</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in produits" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.nom }}</td>
          <td>{{ p.prix }}</td>
          <td>{{ p.quantite }}</td>
          <td><button @click="remove(p.id!)">Supprimer</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useStockStore } from '../stores/stockStore';

const store = useStockStore();
const { produits } = storeToRefs(store);

const nom = ref('');
const prix = ref(0);
const quantite = ref(0);

const load = () => store.loadProduits();

const onAdd = async () => {
  if (!nom.value) return;
  await store.addProduit({
    nom: nom.value,
    prix: prix.value,
    quantite: quantite.value,
    category_id: null,
  });
  nom.value = '';
  prix.value = 0;
  quantite.value = 0;
};

const remove = async (id: number) => {
  await store.deleteProduit(id);
};

onMounted(load);
</script>
