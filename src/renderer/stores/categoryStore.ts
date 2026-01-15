// src/stores/categoryStore.ts
import { defineStore } from 'pinia';

export interface Category {
  id?: number;
  nom: string;
}

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
  }),
  actions: {
    async loadCategories() {
      this.categories = await window.api.category.getAll();
    },

    async addCategory(c: Omit<Category, 'id'>) {
      await window.api.category.add(c);
      await this.loadCategories();
    },

    async updateCategory(c: Category) {
      if (!c.id) return;
      await window.api.category.update(c);
      await this.loadCategories();
    },

    async deleteCategory(id: number) {
      await window.api.category.delete(id);
      await this.loadCategories();
    },
  },
});
