<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <TagIcon class="w-6 h-6 text-blue-600" />
        <h1 class="text-xl font-semibold text-gray-900">Gestion des catégories</h1>
      </div>

      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nouvelle catégorie
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-full max-w-md">
        <MagnifyingGlassIcon
          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          v-model="q"
          type="text"
          placeholder="Rechercher une catégorie..."
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
              <th class="px-6 py-3 text-left">Nom</th>
              <th class="px-6 py-3 text-left">Produits</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="c in filtered" :key="c.id" class="hover:bg-gray-50">
              <!-- Nom -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center font-semibold"
                    :class="badgeClass(c.id)"
                  >
                    {{ (c.nom?.trim()?.[0] ?? '?').toUpperCase() }}
                  </div>

                  <div class="leading-tight">
                    <div class="font-semibold text-gray-900">
                      {{ c.nom }}
                    </div>
                    <div class="text-xs text-gray-500">
                      ID: {{ formatId(c.id) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Produits -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold"
                >
                  {{ (c as any).productsCount ?? 0 }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex justify-end items-center gap-2">
                  <button
                    @click="openEdit(c)"
                    class="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Modifier"
                  >
                    <PencilSquareIcon class="w-5 h-5 text-gray-600" />
                  </button>

                  <button
                    @click="remove(c.id!)"
                    class="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Supprimer"
                  >
                    <TrashIcon class="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filtered.length === 0">
              <td colspan="3" class="px-6 py-10 text-center text-gray-500">
                Aucune catégorie trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 bg-white border-t border-gray-100 text-sm text-gray-500">
        Affichage de
        <span class="font-semibold text-gray-700">{{ filtered.length }}</span>
        catégorie(s)
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">
              {{ editingId === null ? 'Nouvelle catégorie' : 'Modifier la catégorie' }}
            </h2>
            <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100">
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form @submit.prevent="onSubmit" class="p-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                v-model="nom"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Électronique"
              />
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
import { useCategoryStore, type Category } from '../stores/categoryStore'
import { useStockStore } from '../stores/stockStore'

import {
  TagIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const store = useCategoryStore()
const stock = useStockStore()
const { categories } = storeToRefs(store)
const { produits } = storeToRefs(stock)

const q = ref('')
const nom = ref('')
const editingId = ref<number | null>(null)
const isModalOpen = ref(false)

const load = () => store.loadCategories()

const isFormValid = computed(() => nom.value.trim().length > 0)

const filtered = computed(() => {
  const withCounts = categories.value.map((c) => ({
    ...c,
    productsCount: produits.value.filter((p) => (p.category_id ?? null) === (c.id ?? null)).length
  }))
  const query = q.value.trim().toLowerCase()
  if (!query) return withCounts
  return withCounts.filter(c =>
    (c.nom ?? '').toLowerCase().includes(query) ||
    String(c.id ?? '').includes(query)
  )
})

function openCreate() {
  editingId.value = null
  nom.value = ''
  isModalOpen.value = true
}

function openEdit(c: Category) {
  if (!c.id) return
  editingId.value = c.id
  nom.value = c.nom
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingId.value = null
  nom.value = ''
}

async function onSubmit() {
  if (!isFormValid.value) return

  if (editingId.value === null) {
    await store.addCategory({ nom: nom.value.trim() })
  } else {
    await store.updateCategory({ id: editingId.value, nom: nom.value.trim() })
  }

  closeModal()
}

async function remove(id: number) {
  if (!confirm('Supprimer cette catégorie ?')) return
  await store.deleteCategory(id)
}

function formatId(id?: number) {
  if (!id && id !== 0) return '—'
  return `CAT-${String(id).padStart(3, '0')}`
}

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

onMounted(load)
</script>
