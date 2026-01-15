<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <TruckIcon class="w-6 h-6 text-blue-600" />
        <h1 class="text-xl font-semibold text-gray-900">Fournisseurs</h1>
      </div>

      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nouveau fournisseur
      </button>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-full max-w-md">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="q"
          type="text"
          placeholder="Rechercher (nom, téléphone...)"
          class="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        @click="load"
        class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition inline-flex items-center gap-2"
        title="Recharger"
      >
        <ArrowPathIcon class="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-3 text-left">Nom</th>
              <th class="px-6 py-3 text-left">Contact</th>
              <th class="px-6 py-3 text-left">Téléphone</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="f in filtered" :key="f.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">{{ f.nom }}</td>
              <td class="px-6 py-4 text-gray-700">{{ f.contact ?? '-' }}</td>
              <td class="px-6 py-4 text-gray-700">{{ f.telephone ?? '-' }}</td>
              <td class="px-6 py-4 text-gray-700">{{ f.email ?? '-' }}</td>
              <td class="px-6 py-4">
                <div class="flex justify-end items-center gap-2">
                  <button @click="openEdit(f)" class="p-2 rounded-lg hover:bg-gray-100" title="Modifier">
                    <PencilSquareIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <button @click="remove(f.id!)" class="p-2 rounded-lg hover:bg-gray-100" title="Supprimer">
                    <TrashIcon class="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">Aucun fournisseur.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 bg-white border-t border-gray-100 text-sm text-gray-500">
        Affichage de <span class="font-semibold text-gray-700">{{ filtered.length }}</span> fournisseur(s)
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">{{ editingId === null ? 'Nouveau fournisseur' : 'Modifier le fournisseur' }}</h2>
            <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form @submit.prevent="onSubmit" class="p-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input v-model="nom" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nom" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input v-model="contact" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Personne" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input v-model="telephone" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0600..." />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="email" type="email" class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@domaine.com" />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
              <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">Annuler</button>
              <button
                type="submit"
                :disabled="!isFormValid"
                class="px-4 py-2 rounded-lg text-white transition"
                :class="isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
              >
                {{ editingId === null ? 'Créer' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSupplierStore, type Fournisseur } from '../stores/supplierStore';

import {
  TruckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const store = useSupplierStore();
const { fournisseurs } = storeToRefs(store);

const q = ref('');

const nom = ref('');
const contact = ref<string>('');
const telephone = ref<string>('');
const email = ref<string>('');
const editingId = ref<number | null>(null);
const isModalOpen = ref(false);

const load = () => store.load();

onMounted(load);

const isFormValid = computed(() => nom.value.trim().length > 0);

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return fournisseurs.value;
  return fournisseurs.value.filter((f) =>
    [f.nom, f.contact ?? '', f.telephone ?? '', f.email ?? ''].some((x) => x.toLowerCase().includes(query))
  );
});

function openCreate() {
  editingId.value = null;
  resetForm();
  isModalOpen.value = true;
}

function openEdit(f: Fournisseur) {
  if (!f.id) return;
  editingId.value = f.id;
  nom.value = f.nom;
  contact.value = (f.contact ?? '') as string;
  telephone.value = (f.telephone ?? '') as string;
  email.value = (f.email ?? '') as string;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingId.value = null;
}

function resetForm() {
  nom.value = '';
  contact.value = '';
  telephone.value = '';
  email.value = '';
}

async function onSubmit() {
  const payload = {
    nom: nom.value.trim(),
    contact: contact.value.trim() || null,
    telephone: telephone.value.trim() || null,
    email: email.value.trim() || null,
  };

  if (editingId.value === null) {
    await store.add(payload);
  } else {
    await store.update({ id: editingId.value, ...payload });
  }
  closeModal();
}

async function remove(id: number) {
  if (!confirm('Supprimer ce fournisseur ?')) return;
  await store.remove(id);
}
</script>
