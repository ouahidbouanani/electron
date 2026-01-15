import { defineStore } from 'pinia';

export interface Fournisseur {
  id?: number;
  nom: string;
  contact?: string | null;
  telephone?: string | null;
  email?: string | null;
}

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    fournisseurs: [] as Fournisseur[],
  }),
  actions: {
    async load() {
      this.fournisseurs = await window.api.supplier.getAll();
    },
    async add(payload: Omit<Fournisseur, 'id'>) {
      await window.api.supplier.add(payload);
      await this.load();
    },
    async update(payload: Fournisseur) {
      await window.api.supplier.update(payload);
      await this.load();
    },
    async remove(id: number) {
      await window.api.supplier.delete(id);
      await this.load();
    },
  },
});
