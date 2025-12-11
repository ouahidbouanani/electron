// src/stores/clientStore.ts
import { defineStore } from 'pinia';

export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
  }),
  actions: {
    async loadClients() {
      this.clients = await window.api.client.getAll();
    },

    async addClient(c: Omit<Client, 'id'>) {
      await window.api.client.add(c);
      await this.loadClients();
    },

    async updateClient(c: Client) {
      if (!c.id) return;
      await window.api.client.update(c);
      await this.loadClients();
    },

    async deleteClient(id: number) {
      await window.api.client.delete(id);
      await this.loadClients();
    },
  },
});
