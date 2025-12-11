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
      };
    };
  }
}
