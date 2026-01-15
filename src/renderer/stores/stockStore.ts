import { defineStore } from 'pinia';

export interface Produit {
  id?: number;
  nom: string;
  category_id?: number | null;
  prix: number;
  quantite: number;
}

export const useStockStore = defineStore('stock', {
  state: () => ({
    produits: [] as Produit[],
  }),
  actions: {
    async loadProduits() {
      this.produits = await window.api.produit.getAll();
    },
    async addProduit(p: Omit<Produit, 'id'>) {
      await window.api.produit.add(p);
      await this.loadProduits();
    },
    async deleteProduit(id: number) {
      await window.api.produit.delete(id);
      await this.loadProduits();
    },
    async updateProduit(p: Produit) {
      await window.api.produit.update(p);
      await this.loadProduits();
    },
     async loadProduitsByCategory(categoryId: number) {
      
      this.produits = await window.api.produit.getByCategory(categoryId);
    }
  },
});
