import { defineStore } from 'pinia';

export type FactureStatut = 'EMISE' | 'PAYEE' | 'ANNULEE';

export interface Facture {
  id?: number;
  numero: string;
  commande_id: number;
  date: string; // ISO
  total: number;
  statut?: FactureStatut;
}

export const useFactureStore = defineStore('factures', {
  state: () => ({
    factures: [] as Facture[],
  }),
  actions: {
    async load() {
      this.factures = await window.api.facture.getAll();
    },
    async add(payload: Omit<Facture, 'id'>) {
      await window.api.facture.add(payload);
      await this.load();
    },
    async update(payload: Facture) {
      await window.api.facture.update(payload);
      await this.load();
    },
    async remove(id: number) {
      await window.api.facture.delete(id);
      await this.load();
    },
  },
});
