<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <DocumentTextIcon class="w-6 h-6 text-blue-600" />
        <h1 class="text-xl font-semibold text-gray-900">Factures</h1>
      </div>

      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nouvelle facture
      </button>
    </div>

    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="relative w-full max-w-md">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="q"
          type="text"
          placeholder="Rechercher (numéro / commande / statut)..."
          class="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        @click="load"
        class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition inline-flex items-center gap-2"
        title="Recharger"
      >
        <ArrowPathIcon class="w-5 h-5 text-gray-600" />
        Recharger
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
          <tr>
            <th class="px-6 py-3">Numéro</th>
            <th class="px-6 py-3">Commande</th>
            <th class="px-6 py-3">Client</th>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3 text-right">Total</th>
            <th class="px-6 py-3">Statut</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr v-for="f in filtered" :key="f.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-semibold text-gray-900">
              {{ f.numero }}
            </td>

            <td class="px-6 py-4 text-gray-700">#{{ f.commande_id }}</td>

            <td class="px-6 py-4 text-gray-700">
              {{ clientNameByCommande(f.commande_id) }}
            </td>

            <td class="px-6 py-4 text-gray-700">
              {{ formatDate(f.date as any) }}
            </td>

            <td class="px-6 py-4 text-right font-semibold text-gray-900">
              {{ money(f.total) }}
            </td>

            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="statusClass(f.statut)"
              >
                {{ f.statut ?? "EMISE" }}
              </span>
            </td>

            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button @click="openPdf(f.id!)" class="p-2 rounded-lg hover:bg-gray-100" title="Ouvrir PDF">
                  <DocumentArrowDownIcon class="w-5 h-5 text-gray-600" />
                </button>

                <button @click="openEdit(f)" class="p-2 rounded-lg hover:bg-gray-100" title="Modifier">
                  <PencilSquareIcon class="w-5 h-5 text-gray-600" />
                </button>

                <button @click="removeFacture(f.id!)" class="p-2 rounded-lg hover:bg-red-50" title="Supprimer">
                  <TrashIcon class="w-5 h-5 text-red-600" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filtered.length === 0">
            <td colspan="7" class="px-6 py-10 text-center text-sm text-gray-500">
              Aucune facture trouvée
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ editingId ? "Modifier la facture" : "Nouvelle facture" }}
          </h2>
          <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100">
            <XMarkIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Numéro</label>
              <input
                v-model="numero"
                type="text"
                placeholder="FAC-0001"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Commande</label>
              <select
                v-model.number="commandeId"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="0">-- choisir --</option>
                <option v-for="c in commandes" :key="c.id" :value="c.id">
                  #{{ c.id }} • Client {{ c.client_id }} • {{ money(c.total) }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Date</label>
              <input
                v-model="date"
                type="date"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Statut</label>
              <select
                v-model="statut"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EMISE">EMISE</option>
                <option value="PAYEE">PAYEE</option>
                <option value="ANNULEE">ANNULEE</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="text-sm font-medium text-gray-700">Total</label>
              <input
                v-model.number="total"
                type="number"
                step="0.01"
                min="0"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="mt-1 text-xs text-gray-500">Astuce : tu peux mettre le total de la commande (pré-rempli au choix).</p>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
              Annuler
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFactureStore, type Facture, type FactureStatut } from "../stores/factureStore";
import { useOrderStore } from "../stores/orderStore";
import { useClientStore } from "../stores/clientStore";

import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
} from "@heroicons/vue/24/outline";

const store = useFactureStore();
const orders = useOrderStore();
const clients = useClientStore();

const { factures } = storeToRefs(store);
const { commandes } = storeToRefs(orders);
const { clients: clientsList } = storeToRefs(clients);

const q = ref("");

const isModalOpen = ref(false);
const editingId = ref<number | null>(null);

const numero = ref("");
const commandeId = ref<number>(0);
const date = ref<string>(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
const total = ref<number>(0);
const statut = ref<FactureStatut>("EMISE");

const isFormValid = computed(() => numero.value.trim().length > 0 && commandeId.value > 0);

onMounted(async () => {
  await Promise.all([load(), orders.load(), clients.loadClients()]);
});

async function load() {
  await store.load();
}

/**
 * ✅ Fix: f.date peut être string OU Date (selon store / driver SQL).
 * On convertit tout en "YYYY-MM-DD" pour l'input type="date".
 */
function toYMD(input: unknown) {
  if (!input) return new Date().toISOString().slice(0, 10);

  if (typeof input === "string") {
    // ISO ou "YYYY-MM-DD"
    return input.length >= 10 ? input.slice(0, 10) : new Date(input).toISOString().slice(0, 10);
  }

  if (input instanceof Date) {
    return input.toISOString().slice(0, 10);
  }

  if (typeof input === "number") {
    return new Date(input).toISOString().slice(0, 10);
  }

  return new Date(String(input)).toISOString().slice(0, 10);
}

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  if (!s) return factures.value;
  return factures.value.filter(
    (f) =>
      String(f.numero ?? "").toLowerCase().includes(s) ||
      String(f.commande_id ?? "").includes(s) ||
      String(f.statut ?? "").toLowerCase().includes(s)
  );
});

watch(commandeId, (id) => {
  const c = commandes.value.find((x) => x.id === id);
  if (c && !editingId.value) {
    total.value = Number(c.total ?? 0);
  }
});

function openCreate() {
  editingId.value = null;
  numero.value = `FAC-${String(Date.now()).slice(-4)}`;
  commandeId.value = 0;
  date.value = new Date().toISOString().slice(0, 10);
  total.value = 0;
  statut.value = "EMISE";
  isModalOpen.value = true;
}

function openEdit(f: Facture) {
  if (!f.id) return;
  editingId.value = f.id;
  numero.value = f.numero;
  commandeId.value = f.commande_id;

  // ✅ FIX ICI (au lieu de .slice direct)
  date.value = toYMD((f as any).date);

  total.value = Number(f.total ?? 0);
  statut.value = (f.statut ?? "EMISE") as FactureStatut;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function onSubmit() {
  if (!isFormValid.value) return;

  const payload = {
    numero: numero.value.trim(),
    commande_id: commandeId.value,
    date: new Date(date.value).toISOString(),
    total: Number(total.value),
    statut: statut.value,
  };

  if (editingId.value === null) {
    await store.add(payload);
  } else {
    await store.update({ id: editingId.value, ...payload });
  }

  closeModal();
}

async function removeFacture(id: number) {
  if (!confirm("Supprimer cette facture ?")) return;
  await store.remove(id);
}

function clientNameByCommande(cmdId: number) {
  const cmd = commandes.value.find((c) => c.id === cmdId);
  if (!cmd) return "—";
  const cl = clientsList.value.find((x) => x.id === cmd.client_id);
  return cl?.nom ?? `Client #${cmd.client_id}`;
}

async function openPdf(factureId: number) {
  const filePath = await window.api.pdf.facture(factureId);
  const result = await window.api.file.openPath(filePath);
  if (result) alert(result);
}

function statusClass(s?: string) {
  const v = (s ?? "EMISE").toUpperCase();
  if (v === "PAYEE") return "bg-emerald-50 text-emerald-700";
  if (v === "ANNULEE") return "bg-red-50 text-red-700";
  return "bg-blue-50 text-blue-700";
}

function formatDate(iso: unknown) {
  if (!iso) return "—";
  const d = typeof iso === "string" || iso instanceof Date || typeof iso === "number" ? new Date(iso as any) : new Date(String(iso));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR");
}

function money(v: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(v ?? 0));
}
</script>
