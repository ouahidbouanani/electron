import { defineStore } from 'pinia';

export interface Commande {
  id?: number;
  client_id: number;
  date: string; // ISO
  total: number;
}

export interface CommandeLigne {
  id?: number;
  commande_id: number;
  product_id: number;
  product_name?: string;
  quantite: number;
  prix: number;
}

export const useOrderStore = defineStore('orders', {
  state: () => ({
    commandes: [] as Commande[],
  }),
  actions: {
    async load() {
      this.commandes = await window.api.commande.getAll();
    },
    async add(order: Omit<Commande, 'id'>, lignes: Omit<CommandeLigne, 'id'>[]) {
      const res = await window.api.commande.add(order);
      const commandeId = (res?.id ?? res?.insertId ?? res) as number;
      for (const l of lignes) {
        await window.api.commandeLigne.add({ ...l, commande_id: commandeId });
      }
      await this.load();
      return commandeId;
    },
    async update(order: Commande) {
      await window.api.commande.update(order);
      await this.load();
    },
    async remove(id: number) {
      await window.api.commande.delete(id);
      await this.load();
    },
    async getLignes(commandeId: number) {
      return await window.api.commandeLigne.getByCommande(commandeId);
    },
  },
});
