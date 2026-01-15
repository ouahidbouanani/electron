<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500">Résumé de votre activité</p>
      </div>
      <button
        @click="refresh"
        class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition inline-flex items-center gap-2"
        title="Recharger"
      >
        <ArrowPathIcon class="w-5 h-5 text-gray-600" />
        Recharger
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="text-sm text-gray-500">Produits</div>
        <div class="mt-1 text-3xl font-bold text-gray-900">{{ produitsCount }}</div>
        <div class="mt-2 text-xs text-gray-500">Total en base</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="text-sm text-gray-500">Stock bas</div>
        <div class="mt-1 text-3xl font-bold" :class="stockBas > 0 ? 'text-red-600' : 'text-emerald-600'">
          {{ stockBas }}
        </div>
        <div class="mt-2 text-xs text-gray-500">Produits avec quantité = 0</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="text-sm text-gray-500">Clients</div>
        <div class="mt-1 text-3xl font-bold text-gray-900">{{ clientsCount }}</div>
        <div class="mt-2 text-xs text-gray-500">Répertoire</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="text-sm text-gray-500">Commandes</div>
        <div class="mt-1 text-3xl font-bold text-gray-900">{{ commandesCount }}</div>
        <div class="mt-2 text-xs text-gray-500">Historique</div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900">Derniers produits</h2>
          <p class="text-sm text-gray-500">Aperçu rapide</p>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="p in lastProduits" :key="p.id" class="px-5 py-3 flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">{{ p.nom }}</div>
              <div class="text-xs text-gray-500">ID: {{ p.id }} • Qté: {{ p.quantite }}</div>
            </div>
            <div class="text-sm text-gray-700">{{ formatPrice(p.prix) }}</div>
          </div>
          <div v-if="lastProduits.length === 0" class="px-5 py-10 text-center text-gray-500">
            Aucun produit.
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900">Dernières livraisons</h2>
          <p class="text-sm text-gray-500">Suivi</p>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="l in lastLivraisons" :key="l.id" class="px-5 py-3 flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">Livraison #{{ l.id }}</div>
              <div class="text-xs text-gray-500">Commande: #{{ l.commande_id }} • {{ formatDate(l.date_livraison) }}</div>
            </div>
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
              :class="statusClass(l.statut)"
            >
              {{ l.statut ?? 'EN_ATTENTE' }}
            </span>
          </div>
          <div v-if="lastLivraisons.length === 0" class="px-5 py-10 text-center text-gray-500">
            Aucune livraison.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useStockStore } from '../stores/stockStore';
import { useClientStore } from '../stores/clientStore';
import { useOrderStore } from '../stores/orderStore';
import { useShipmentStore } from '../stores/shipmentStore';

import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const stock = useStockStore();
const clients = useClientStore();
const orders = useOrderStore();
const shipments = useShipmentStore();

const { produits } = storeToRefs(stock);
const { clients: clientsList } = storeToRefs(clients);
const { commandes } = storeToRefs(orders);
const { livraisons } = storeToRefs(shipments);

onMounted(async () => {
  await refresh();
});

async function refresh() {
  await Promise.all([stock.loadProduits(), clients.loadClients(), orders.load(), shipments.load()]);
}

const produitsCount = computed(() => produits.value.length);
const clientsCount = computed(() => clientsList.value.length);
const commandesCount = computed(() => commandes.value.length);
const stockBas = computed(() => produits.value.filter((p) => (p.quantite ?? 0) <= 0).length);

const lastProduits = computed(() => produits.value.slice(0, 5));
const lastLivraisons = computed(() => livraisons.value.slice(0, 5));

function formatPrice(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v ?? 0);
}

function formatDate(v?: string) {
  if (!v) return '-';
  return new Date(v).toLocaleString('fr-FR');
}

function statusClass(statut?: string) {
  switch (statut) {
    case 'LIVRE':
      return 'bg-emerald-50 text-emerald-700';
    case 'EXPEDIE':
      return 'bg-blue-50 text-blue-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}
</script>
