<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <CubeIcon class="w-6 h-6 text-blue-600" />
        <h1 class="text-xl font-semibold text-gray-900">Gestion des produits</h1>
      </div>

      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nouveau produit
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-full max-w-md">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="q"
          type="text"
          placeholder="Rechercher (nom, ID...)"
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

    <!-- Table card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-3 text-left">Produit</th>
              <th class="px-6 py-3 text-left">Catégorie</th>
              <th class="px-6 py-3 text-left">Prix</th>
              <th class="px-6 py-3 text-left">Quantité</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="p in filtered" :key="p.id" class="hover:bg-gray-50">
              <!-- Produit -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center font-semibold"
                       :class="badgeClass(p.id)">
                    {{ (p.nom?.trim()?.[0] ?? '?').toUpperCase() }}
                  </div>

                  <div class="leading-tight">
                    <div class="font-semibold text-gray-900">
                      {{ p.nom }}
                    </div>
                    <div class="text-xs text-gray-500">
                      ID: {{ formatId(p.id) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Catégorie -->
              <td class="px-6 py-4 text-gray-700">
                {{ categoryLabel(p.category_id) }}
              </td>

              <!-- Prix -->
              <td class="px-6 py-4 text-gray-700">
                {{ formatPrice(p.prix) }}
              </td>

              <!-- Quantité -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="p.quantite > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
                >
                  {{ p.quantite }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex justify-end items-center gap-2">
                  <button
                    @click="openEdit(p)"
                    class="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Modifier"
                  >
                    <PencilSquareIcon class="w-5 h-5 text-gray-600" />
                  </button>

                  <button
                    @click="remove(p.id!)"
                    class="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Supprimer"
                  >
                    <TrashIcon class="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filtered.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                Aucun produit trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 bg-white border-t border-gray-100 text-sm text-gray-500">
        Affichage de <span class="font-semibold text-gray-700">{{ filtered.length }}</span> produit(s)
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">
              {{ editingId === null ? 'Nouveau produit' : 'Modifier le produit' }}
            </h2>

            <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form @submit.prevent="onSubmit" class="p-5 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  v-model="nom"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du produit"
                />
              </div>

              <div class="md:col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  v-model.number="categoryId"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Aucune</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <input
                  v-model.number="prix"
                  type="number"
                  step="0.01"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input
                  v-model.number="quantite"
                  type="number"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                Annuler
              </button>

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
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStockStore, type Produit } from '../stores/stockStore'
import { useCategoryStore } from '../stores/categoryStore'

import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const store = useStockStore()
const { produits } = storeToRefs(store)

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

const q = ref('')

const nom = ref('')
const prix = ref<number>(0)
const quantite = ref<number>(0)
const categoryId = ref<number | null>(null)
const editingId = ref<number | null>(null)

const isModalOpen = ref(false)

const load = () => store.loadProduits()

const isFormValid = computed(() =>
  nom.value.trim().length > 0 && prix.value > 0 && quantite.value >= 0
)

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return produits.value

  return produits.value.filter(p =>
    (p.nom ?? '').toLowerCase().includes(query) ||
    String(p.id ?? '').includes(query) ||
    categoryLabel(p.category_id).toLowerCase().includes(query)
  )
})

function openCreate() {
  editingId.value = null
  resetForm()
  isModalOpen.value = true
}

function openEdit(p: Produit) {
  if (!p.id) return
  editingId.value = p.id
  nom.value = p.nom
  prix.value = p.prix
  quantite.value = p.quantite
  categoryId.value = (p.category_id ?? null) as any
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingId.value = null
  resetForm()
}

function resetForm() {
  nom.value = ''
  prix.value = 0
  quantite.value = 0
  categoryId.value = null
}

async function onSubmit() {
  if (!isFormValid.value) return

  if (editingId.value === null) {
    await store.addProduit({
      nom: nom.value.trim(),
      prix: prix.value,
      quantite: quantite.value,
      category_id: categoryId.value
    })
  } else {
    await store.updateProduit({
      id: editingId.value,
      nom: nom.value.trim(),
      prix: prix.value,
      quantite: quantite.value,
      category_id: categoryId.value
    })
  }

  closeModal()
}

async function remove(id: number) {
  if (!confirm('Supprimer ce produit ?')) return
  await store.deleteProduit(id)
}

/** UI helpers */
function formatId(id?: number) {
  if (!id && id !== 0) return '—'
  return `PRD-${String(id).padStart(3, '0')}`
}

function categoryLabel(category_id?: number | null) {
  if (!category_id) return '—'
  const c = categories.value.find((x) => x.id === category_id)
  return c ? c.nom : `#${category_id}`
}

function formatPrice(v: number) {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
  } catch {
    return `${v} €`
  }
}

/* classes fixes pour Tailwind */
const badgeVariants = [
  'bg-blue-50 text-blue-700',
  'bg-orange-50 text-orange-700',
  'bg-purple-50 text-purple-700',
  'bg-pink-50 text-pink-700',
  'bg-emerald-50 text-emerald-700',
  'bg-indigo-50 text-indigo-700'
]
function badgeClass(id?: number) {
  const idx = Math.abs((id ?? 0)) % badgeVariants.length
  return badgeVariants[idx]
}

onMounted(async () => {
  await Promise.all([categoryStore.loadCategories(), store.loadProduits()])
})
</script>
