// src/env.d.ts
export {};

declare global {
  interface Window {
    api: {
      produit: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        add: (payload: any) => Promise<{ id: number }>;
        update: (payload: any) => Promise<void>;
        delete: (id: number) => Promise<void>;
        getByCategory: (categoryId: number) => Promise<any[]>;
      };

      category: {
        getAll: () => Promise<any[]>;
        add: (payload: any) => Promise<any>;
        update: (payload: any) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };

      client: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        add: (payload: any) => Promise<any>;
        update: (payload: any) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };

      commande: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        add: (payload: any) => Promise<any>;
        update: (payload: any) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };

      commandeLigne: {
        getByCommande: (commandeId: number) => Promise<any[]>;
        add: (payload: any) => Promise<any>;
        delete: (id: number) => Promise<void>;
      };
    };
  }
}
