import { defineStore } from 'pinia';

export type ShipmentStatus = 'EN_ATTENTE' | 'EXPEDIE' | 'LIVRE';

export interface Livraison {
  id?: number;
  commande_id: number;
  date_livraison?: string;
  statut?: ShipmentStatus;
}

export const useShipmentStore = defineStore('shipments', {
  state: () => ({
    livraisons: [] as Livraison[],
  }),
  actions: {
    async load() {
      this.livraisons = await window.api.shipment.getAll();
    },
    async add(payload: Omit<Livraison, 'id'>) {
      await window.api.shipment.add(payload);
      await this.load();
    },
    async update(payload: Livraison) {
      await window.api.shipment.update(payload);
      await this.load();
    },
    async remove(id: number) {
      await window.api.shipment.delete(id);
      await this.load();
    },
  },
});
