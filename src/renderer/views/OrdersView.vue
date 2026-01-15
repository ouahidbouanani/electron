<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <ShoppingCartIcon class="w-6 h-6 text-blue-600" />
        <h1 class="text-xl font-semibold text-gray-900">Commandes</h1>
      </div>

      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nouvelle commande
      </button>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-full max-w-md">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="q"
          type="text"
          placeholder="Rechercher (ID, client...)"
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
              <th class="px-6 py-3 text-left">Commande</th>
              <th class="px-6 py-3 text-left">Client</th>
              <th class="px-6 py-3 text-left">Date</th>
              <th class="px-6 py-3 text-left">Total</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="c in filtered" :key="c.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">#{{ c.id }}</td>
              <td class="px-6 py-4 text-gray-700">{{ clientLabel(c.client_id) }}</td>
              <td class="px-6 py-4 text-gray-700">{{ fmtDate(c.date) }}</td>
              <td class="px-6 py-4 text-gray-700">{{ fmtMoney(c.total) }}</td>
              <td class="px-6 py-4">
                <div class="flex justify-end items-center gap-2">
                  <button @click="openDetails(c.id!)" class="p-2 rounded-lg hover:bg-gray-100" title="Détails">
                    <EyeIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    @click="genBonCommande(c.id!)"
                    class="p-2 rounded-lg hover:bg-gray-100"
                    title="PDF bon de commande"
                  >
                    <DocumentArrowDownIcon class="w-5 h-5 text-gray-600" />
                  </button>
                  <button @click="remove(c.id!)" class="p-2 rounded-lg hover:bg-gray-100" title="Supprimer">
                    <TrashIcon class="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">Aucune commande.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 bg-white border-t border-gray-100 text-sm text-gray-500">
        Affichage de <span class="font-semibold text-gray-700">{{ filtered.length }}</span> commande(s)
      </div>
    </div>

    <!-- Modal création -->
    <div v-if="isCreateOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeCreate"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">Nouvelle commande</h2>
            <button @click="closeCreate" class="p-2 rounded-lg hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form @submit.prevent="submitCreate" class="p-5 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  v-model.number="clientId"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="0" disabled>Choisir un client...</option>
                  <option v-for="cl in clientsList" :key="cl.id" :value="cl.id">
                    {{ cl.nom }} {{ cl.prenom }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  v-model="date"
                  type="datetime-local"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="font-semibold text-gray-900">Lignes</div>
                <button
                  type="button"
                  @click="addLine"
                  class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                >
                  + Ajouter ligne
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="text-xs text-gray-500 uppercase">
                    <tr>
                      <th class="text-left py-2 pr-2">Produit</th>
                      <th class="text-left py-2 pr-2">Prix</th>
                      <th class="text-left py-2 pr-2">Quantité</th>
                      <th class="text-left py-2 pr-2">Sous-total</th>
                      <th class="text-right py-2"> </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(l, idx) in lignes" :key="idx">
                      <td class="py-2 pr-2 min-w-[260px]">
                        <select
                          v-model.number="l.product_id"
                          @change="syncLineProduct(idx)"
                          class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option :value="0" disabled>Choisir un produit...</option>
                          <option v-for="p in produits" :key="p.id" :value="p.id">
                            {{ p.nom }} (stock: {{ p.quantite }})
                          </option>
                        </select>
                      </td>

                      <td class="py-2 pr-2 w-[150px]">
                        <input
                          v-model.number="l.prix"
                          type="number"
                          step="0.01"
                          class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td class="py-2 pr-2 w-[190px]">
                        <input
                          v-model.number="l.quantite"
                          type="number"
                          min="1"
                          class="w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                          :class="
                            stockError(l)
                              ? 'border border-red-300 focus:ring-red-500'
                              : 'border border-gray-200 focus:ring-blue-500'
                          "
                        />
                        <!-- ✅ seul message affiché -->
                        <p v-if="stockError(l)" class="mt-1 text-xs text-red-600">
                          {{ stockError(l) }}
                        </p>
                      </td>

                      <td class="py-2 pr-2 font-medium text-gray-900">
                        {{ fmtMoney((l.prix || 0) * (l.quantite || 0)) }}
                      </td>

                      <td class="py-2 text-right">
                        <button
                          type="button"
                          @click="removeLine(idx)"
                          class="p-2 rounded-lg hover:bg-gray-100"
                          title="Supprimer ligne"
                        >
                          <XMarkIcon class="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>

                    <tr v-if="lignes.length === 0">
                      <td colspan="5" class="py-6 text-center text-gray-500">Aucune ligne.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-3 flex items-center justify-end">
                <div class="text-right">
                  <div class="text-xs text-gray-500">Total</div>
                  <div class="text-2xl font-bold text-gray-900">{{ fmtMoney(total) }}</div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                @click="closeCreate"
                class="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                :disabled="!canSubmit"
                class="px-4 py-2 rounded-lg text-white transition"
                :class="canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal détails -->
    <div v-if="isDetailsOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeDetails"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">Commande #{{ detailsId }}</h2>
            <button @click="closeDetails" class="p-2 rounded-lg hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div class="text-xs text-gray-500">Client</div>
                <div class="font-semibold text-gray-900">{{ clientLabel(detailsOrder?.client_id ?? 0) }}</div>
              </div>
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div class="text-xs text-gray-500">Date</div>
                <div class="font-semibold text-gray-900">{{ fmtDate(detailsOrder?.date) }}</div>
              </div>
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div class="text-xs text-gray-500">Total</div>
                <div class="font-semibold text-gray-900">{{ fmtMoney(detailsOrder?.total ?? 0) }}</div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">Lignes</div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                      <th class="px-4 py-3 text-left">Produit</th>
                      <th class="px-4 py-3 text-left">Quantité</th>
                      <th class="px-4 py-3 text-left">Prix</th>
                      <th class="px-4 py-3 text-left">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="l in detailsLignes" :key="l.id">
                      <td class="px-4 py-3 font-medium text-gray-900">{{ l.product_name ?? ('#'+l.product_id) }}</td>
                      <td class="px-4 py-3 text-gray-700">{{ l.quantite }}</td>
                      <td class="px-4 py-3 text-gray-700">{{ fmtMoney(l.prix) }}</td>
                      <td class="px-4 py-3 text-gray-700">{{ fmtMoney(l.prix * l.quantite) }}</td>
                    </tr>
                    <tr v-if="detailsLignes.length === 0">
                      <td colspan="4" class="px-4 py-8 text-center text-gray-500">Aucune ligne.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              @click="genBonCommande(detailsId!)"
              class="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              Générer PDF
            </button>
            <button @click="closeDetails" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { useOrderStore, type CommandeLigne } from "../stores/orderStore";
import { useClientStore } from "../stores/clientStore";
import { useStockStore } from "../stores/stockStore";

import {
  ShoppingCartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  DocumentArrowDownIcon,
} from "@heroicons/vue/24/outline";

const orders = useOrderStore();
const clients = useClientStore();
const stock = useStockStore();

const { commandes } = storeToRefs(orders);
const { clients: clientsList } = storeToRefs(clients);
const { produits } = storeToRefs(stock);

const q = ref("");

onMounted(async () => {
  await refresh();
});

async function refresh() {
  await Promise.all([orders.load(), clients.loadClients(), stock.loadProduits()]);
}

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return commandes.value;
  return commandes.value.filter((c) =>
    [String(c.id ?? ""), clientLabel(c.client_id), fmtDate(c.date)].some((x) =>
      x.toLowerCase().includes(query)
    )
  );
});

function clientLabel(clientId: number) {
  const cl = clientsList.value.find((c) => c.id === clientId);
  if (!cl) return `Client #${clientId}`;
  return `${cl.nom} ${cl.prenom}`.trim();
}

function fmtMoney(v: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v ?? 0);
}

function fmtDate(v?: string) {
  if (!v) return "-";
  return new Date(v).toLocaleString("fr-FR");
}

// ---------- Création ----------
const isCreateOpen = ref(false);
const clientId = ref<number>(0);
const date = ref<string>(toDatetimeLocal(new Date()));

type DraftLine = { product_id: number; product_name?: string; quantite: number; prix: number };
const lignes = ref<DraftLine[]>([]);

const total = computed(() =>
  lignes.value.reduce((s, l) => s + (l.prix || 0) * (l.quantite || 0), 0)
);

function stockForProduct(productId: number) {
  const p = produits.value.find((x) => x.id === productId);
  return p?.quantite ?? 0;
}

/**
 * ✅ Affiche erreur uniquement si un produit est choisi ET quantité > stock
 */
function stockError(l: DraftLine) {
  if (!l.product_id) return "";
  const dispo = stockForProduct(l.product_id);
  if (!l.quantite || l.quantite <= 0) return "Quantité invalide";
  if (l.quantite > dispo) return `Stock insuffisant : disponible ${dispo}`;
  return "";
}

function formError(l: DraftLine) {
  if (!l.product_id) return "Choisir un produit";
  if (!l.quantite || l.quantite <= 0) return "Quantité invalide";
  return "";
}

const canSubmit = computed(() => {
  if (!clientId.value) return false;
  if (lignes.value.length === 0) return false;

  for (const l of lignes.value) {
    if (formError(l)) return false;
    if (stockError(l)) return false;
    if (l.prix < 0) return false;
  }
  return true;
});

function openCreate() {
  clientId.value = 0;
  date.value = toDatetimeLocal(new Date());
  lignes.value = [];
  isCreateOpen.value = true;
}

function closeCreate() {
  isCreateOpen.value = false;
}

function addLine() {
  lignes.value.push({ product_id: 0, product_name: "", quantite: 1, prix: 0 });
}

function removeLine(idx: number) {
  lignes.value.splice(idx, 1);
}

function syncLineProduct(idx: number) {
  const line = lignes.value[idx];
  const p = produits.value.find((x) => x.id === line.product_id);
  if (!p) return;

  line.product_name = p.nom;
  if (!line.prix) line.prix = p.prix;

  // clamp si dépasse stock
  if (line.quantite > p.quantite) line.quantite = p.quantite > 0 ? p.quantite : 1;
}

async function submitCreate() {
  if (!canSubmit.value) {
    alert("Corrige les erreurs avant de créer la commande.");
    return;
  }

  const orderPayload = {
    client_id: clientId.value,
    date: new Date(date.value).toISOString(),
    total: total.value,
  };

  const lignesPayload = lignes.value.map(
    (l) =>
      ({
        commande_id: 0,
        product_id: l.product_id,
        product_name: l.product_name,
        quantite: l.quantite,
        prix: l.prix,
      } as Omit<CommandeLigne, "id">)
  );

  try {
    const commandeId = await orders.add(orderPayload, lignesPayload);
    closeCreate();
    await refresh();
    await openDetails(commandeId);
    await stock.loadProduits();
  } catch (e: any) {
    alert(e?.message ?? "Erreur création commande");
  }
}

// ---------- Détails ----------
const isDetailsOpen = ref(false);
const detailsId = ref<number | null>(null);
const detailsOrder = computed(() => commandes.value.find((c) => c.id === detailsId.value) || null);
const detailsLignes = ref<any[]>([]);

async function openDetails(id: number) {
  detailsId.value = id;
  detailsLignes.value = await orders.getLignes(id);
  isDetailsOpen.value = true;
}

function closeDetails() {
  isDetailsOpen.value = false;
  detailsId.value = null;
  detailsLignes.value = [];
}

async function remove(id: number) {
  if (!confirm("Supprimer cette commande ? (les lignes seront supprimées aussi)")) return;
  await orders.remove(id);
  await refresh();
}

async function genBonCommande(id: number) {
  const p = await window.api.pdf.bonCommande(id);
  const err = await window.api.file.openPath(p);
  if (err) alert(`Impossible d'ouvrir le PDF :\n${err}\n\nChemin: ${p}`);
}

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
</script>
