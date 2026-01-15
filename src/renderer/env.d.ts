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

      supplier: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        add: (payload: any) => Promise<{ id: number } | any>;
        update: (payload: any) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };

      shipment: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        getByCommande: (commandeId: number) => Promise<any[]>;
        add: (payload: any) => Promise<{ id: number } | any>;
        update: (payload: any) => Promise<void>;
        delete: (id: number) => Promise<void>;
      };

      auth: {
        register: (payload: { nom: string; email: string; password: string }) => Promise<{ id: number; nom: string; email: string; created_at: string } | null>;
        login: (payload: { email: string; password: string }) => Promise<{ id: number; nom: string; email: string; created_at: string } | null>;
        logout: () => Promise<boolean>;
        me: () => Promise<{ id: number; nom: string; email: string; created_at: string } | null>;
      };

      
      facture: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        add: (payload: any) => Promise<any>;
        update: (payload: any) => Promise<any>;
        delete: (id: number) => Promise<any>;
        getByCommande: (commandeId: number) => Promise<any[]>;
      };

pdf: {
        bonCommande: (commandeId: number) => Promise<string>;
        bonLivraison: (livraisonId: number) => Promise<string>;
        facture: (factureId: number) => Promise<string>;
      };

      file: {
        /** Opens the file with the default OS application. Returns empty string on success, otherwise an error message. */
        openPath: (filePath: string) => Promise<string>;
      };
    };
  }
}
