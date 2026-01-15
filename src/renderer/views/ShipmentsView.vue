<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <ClipboardDocumentListIcon class="w-6 h-6 text-blue-600" />
        <h1 class="text-xl font-semibold text-gray-900">Livraisons</h1>
      </div>

      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nouvelle livraison
      </button>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-full max-w-md">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="q"
          type="text"
          placeholder="Rechercher (ID, commande, statut...)"
          class="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        @click="refresh"
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
              <th class="px-6 py-3 text-left">Livraison</th>
              <th class="px-6 py-3 text-left">Commande</th>
              <th class="px-6 py-3 text-left">Date</th>
              <th class="px-6 py-3 text-left">Statut</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="l in filtered" :key="l.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">#{{ l.id }}</td>
              <td class="px-6 py-4 text-gray-700">#{{ l.commande_id }}</td>
              <td class="px-6 py-4 text-gray-700">{{ fmtDate(l.date_livraison) }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="statusClass(l.statut)"
                >
                  {{ l.statut ?? 'EN_ATTENTE' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end items-center gap-2">
                  <button @click="openEdit(l)" class="p-2 rounded-lg hover:bg-gray-100" title="Modifier">
                    <PencilSquareIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <button @click="genBonLivraison(l.id!)" class="p-2 rounded-lg hover:bg-gray-100" title="PDF bon de livraison">
                    <DocumentArrowDownIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <button @click="remove(l.id!)" class="p-2 rounded-lg hover:bg-gray-100" title="Supprimer">
                    <TrashIcon class="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">Aucune livraison.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 bg-white border-t border-gray-100 text-sm text-gray-500">
        Affichage de <span class="font-semibold text-gray-700">{{ filtered.length }}</span> livraison(s)
      </div>
    </div>

    <!-- Modal create/edit -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">{{ editingId === null ? 'Nouvelle livraison' : 'Modifier la livraison' }}</h2>
            <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form @submit.prevent="onSubmit" class="p-5 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Commande</label>
                <select
                  v-model.number="commandeId"
                  :disabled="editingId !== null"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="0" disabled>Choisir une commande...</option>
                  <option v-for="c in commandes" :key="c.id" :value="c.id">
                    #{{ c.id }} — {{ fmtMoney(c.total) }}
                  </option>
                </select>
                <p v-if="editingId !== null" class="text-xs text-gray-500 mt-1">Pour changer la commande, crée une nouvelle livraison.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date livraison</label>
                <input
                  v-model="dateLivraison"
                  type="datetime-local"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  v-model="statut"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EN_ATTENTE">EN_ATTENTE</option>
                  <option value="EXPEDIE">EXPEDIE</option>
                  <option value="LIVRE">LIVRE</option>
                </select>
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

import { useShipmentStore, type Livraison, type ShipmentStatus } from '../stores/shipmentStore';
import { useOrderStore } from '../stores/orderStore';

import {
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon,
} from '@heroicons/vue/24/outline';

const shipments = useShipmentStore();
const orders = useOrderStore();

const { livraisons } = storeToRefs(shipments);
const { commandes } = storeToRefs(orders);

const q = ref('');

onMounted(async () => {
  await refresh();
});

async function refresh() {
  await Promise.all([shipments.load(), orders.load()]);
}

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return livraisons.value;
  return livraisons.value.filter((l) =>
    [String(l.id ?? ''), String(l.commande_id ?? ''), l.statut ?? '', fmtDate(l.date_livraison)].some((x) =>
      x.toLowerCase().includes(query)
    )
  );
});

// Modal
const isModalOpen = ref(false);
const editingId = ref<number | null>(null);

const commandeId = ref<number>(0);
const dateLivraison = ref<string>(toDatetimeLocal(new Date()));
const statut = ref<ShipmentStatus>('EN_ATTENTE');

const isFormValid = computed(() => {
  if (!commandeId.value) return false;
  return true;
});

function openCreate() {
  editingId.value = null;
  commandeId.value = 0;
  dateLivraison.value = toDatetimeLocal(new Date());
  statut.value = 'EN_ATTENTE';
  isModalOpen.value = true;
}

function openEdit(l: Livraison) {
  if (!l.id) return;
  editingId.value = l.id;
  commandeId.value = l.commande_id;
  dateLivraison.value = toDatetimeLocal(l.date_livraison ? new Date(l.date_livraison) : new Date());
  statut.value = (l.statut ?? 'EN_ATTENTE') as ShipmentStatus;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingId.value = null;
}

async function onSubmit() {
  const payload = {
    commande_id: commandeId.value,
    date_livraison: new Date(dateLivraison.value).toISOString(),
    statut: statut.value,
  };

  if (editingId.value === null) {
    await shipments.add(payload);
  } else {
    await shipments.update({ id: editingId.value, ...payload });
  }
  closeModal();
}

async function remove(id: number) {
  if (!confirm('Supprimer cette livraison ?')) return;
  await shipments.remove(id);
}

async function genBonLivraison(id: number) {
  const p = await window.api.pdf.bonLivraison(id);
  const err = await window.api.file.openPath(p);
  if (err) alert(`Impossible d'ouvrir le PDF :\n${err}\n\nChemin: ${p}`);
}

function fmtMoney(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v ?? 0);
}

function fmtDate(v?: string) {
  if (!v) return '-';
  return new Date(v).toLocaleString('fr-FR');
}

function statusClass(st?: string) {
  switch (st) {
    case 'LIVRE':
      return 'bg-emerald-50 text-emerald-700';
    case 'EXPEDIE':
      return 'bg-blue-50 text-blue-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
</script>
