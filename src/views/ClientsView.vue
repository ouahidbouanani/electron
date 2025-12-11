<template>
  <div class="p-6">

    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      Gestion de stocks - Clients
    </h1>

    <!-- Formulaire d'ajout / édition -->
    <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 items-end">
      <div>
        <label class="block text-sm font-medium mb-1">Nom</label>
        <input
          v-model="nom"
          placeholder="Nom du client"
          class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Prénom</label>
        <input
          v-model="prenom"
          placeholder="Prénom du client"
          class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Téléphone</label>
        <input
          v-model="telephone"
          placeholder="Téléphone"
          class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'flex-1 px-4 py-2 rounded text-sm font-medium transition',
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
      </div>
    </form>

    <!-- Bouton Recharger -->
    <button
      @click="load"
      class="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
    >
      Recharger
    </button>

    <!-- Tableau des clients -->
    <table class="w-full border border-gray-300 text-left text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="border border-gray-300 px-2 py-2">ID</th>
          <th class="border border-gray-300 px-2 py-2">Nom</th>
          <th class="border border-gray-300 px-2 py-2">Prénom</th>
          <th class="border border-gray-300 px-2 py-2">Email</th>
          <th class="border border-gray-300 px-2 py-2">Téléphone</th>
          <th class="border border-gray-300 px-2 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in clients"
          :key="c.id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="border border-gray-300 px-2 py-2">{{ c.id }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ c.nom }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ c.prenom }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ c.email }}</td>
          <td class="border border-gray-300 px-2 py-2">{{ c.telephone }}</td>
          <td class="border border-gray-300 px-2 py-2 text-center space-x-2">
            <button
              @click="startEdit(c)"
              class="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition text-xs"
            >
              Modifier
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
import { useClientStore, type Client } from '../stores/clientStore';

const store = useClientStore();
const { clients } = storeToRefs(store);

const nom = ref('');
const prenom = ref('');
const email = ref('');
const telephone = ref('');
const editingId = ref<number | null>(null); // null = ajout, sinon = édition

const load = () => store.loadClients();

const isFormValid = computed(() =>
  nom.value.trim().length > 0 &&
  prenom.value.trim().length > 0 &&
  email.value.trim().length > 0 &&
  telephone.value.trim().length > 0
);

const resetForm = () => {
  nom.value = '';
  prenom.value = '';
  email.value = '';
  telephone.value = '';
  editingId.value = null;
};

const onSubmit = async () => {
  if (!isFormValid.value) return;

  if (editingId.value === null) {
    // mode AJOUT
    await store.addClient({
      nom: nom.value.trim(),
      prenom: prenom.value.trim(),
      email: email.value.trim(),
      telephone: telephone.value.trim(),
    });
  } else {
    // mode UPDATE
    await store.updateClient({
      id: editingId.value,
      nom: nom.value.trim(),
      prenom: prenom.value.trim(),
      email: email.value.trim(),
      telephone: telephone.value.trim(),
    });
  }

  resetForm();
};

const startEdit = (client: Client) => {
  if (!client.id) return;
  editingId.value = client.id;
  nom.value = client.nom;
  prenom.value = client.prenom;
  email.value = client.email;
  telephone.value = client.telephone;
};

const remove = async (id: number) => {
  if (!confirm('Supprimer ce client ?')) return;
  await store.deleteClient(id);
};

onMounted(load);
</script>
