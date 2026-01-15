import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  produit: {
    getAll: () => ipcRenderer.invoke('produit:getAll'),
    getById: (id: number) => ipcRenderer.invoke('produit:getById', id),
    add: (payload: any) => ipcRenderer.invoke('produit:add', payload),
    update: (payload: any) => ipcRenderer.invoke('produit:update', payload),
    delete: (id: number) => ipcRenderer.invoke('produit:delete', id),
    getByCategory: (categoryId: number) => ipcRenderer.invoke('produit:getByCategory', categoryId),
  },
  category: {
    getAll: () => ipcRenderer.invoke('category:getAll'),
    add: (payload: any) => ipcRenderer.invoke('category:add', payload),
    update: (payload: any) => ipcRenderer.invoke('category:update', payload),
    delete: (id: number) => ipcRenderer.invoke('category:delete', id),
  },
  client: {
    getAll: () => ipcRenderer.invoke('client:getAll'),
    getById: (id: number) => ipcRenderer.invoke('client:getById', id),
    add: (payload: any) => ipcRenderer.invoke('client:add', payload),
    update: (payload: any) => ipcRenderer.invoke('client:update', payload),
    delete: (id: number) => ipcRenderer.invoke('client:delete', id),
  },
  commande: {
    getAll: () => ipcRenderer.invoke('commande:getAll'),
    getById: (id: number) => ipcRenderer.invoke('commande:getById', id),
    add: (payload: any) => ipcRenderer.invoke('commande:add', payload),
    update: (payload: any) => ipcRenderer.invoke('commande:update', payload),
    delete: (id: number) => ipcRenderer.invoke('commande:delete', id),
  },
  commandeLigne: {
    getByCommande: (commandeId: number) =>
      ipcRenderer.invoke('commandeLigne:getByCommande', commandeId),
    add: (payload: any) => ipcRenderer.invoke('commandeLigne:add', payload),
    delete: (id: number) => ipcRenderer.invoke('commandeLigne:delete', id),
  },
   supplier: {
    getAll: () => ipcRenderer.invoke("fournisseur:getAll"),
    getById: (id: number) => ipcRenderer.invoke("fournisseur:getById", id),
    add: (data: any) => ipcRenderer.invoke("fournisseur:add", data),
    update: (data: any) => ipcRenderer.invoke("fournisseur:update", data),
    delete: (id: number) => ipcRenderer.invoke("fournisseur:delete", id),
  },
   shipment: {
    add: (payload: any) => ipcRenderer.invoke("livraison:add", payload),
    getAll: () => ipcRenderer.invoke("livraison:getAll"),
    getById: (id: number) => ipcRenderer.invoke("livraison:getById", id),
    getByCommande: (commandeId: number) => ipcRenderer.invoke("livraison:getByCommande", commandeId),
    update: (payload: any) => ipcRenderer.invoke("livraison:update", payload),
    delete: (id: number) => ipcRenderer.invoke("livraison:delete", id),
  },
  auth: {
    register: (payload: { nom: string; email: string; password: string }) =>
      ipcRenderer.invoke("auth:register", payload),
    login: (payload: { email: string; password: string }) =>
      ipcRenderer.invoke("auth:login", payload),
    logout: () => ipcRenderer.invoke("auth:logout"),
    me: () => ipcRenderer.invoke("auth:me"),
  },

  
  facture: {
    getAll: () => ipcRenderer.invoke("facture:getAll"),
    getById: (id: number) => ipcRenderer.invoke("facture:getById", id),
    add: (payload: any) => ipcRenderer.invoke("facture:add", payload),
    update: (payload: any) => ipcRenderer.invoke("facture:update", payload),
    delete: (id: number) => ipcRenderer.invoke("facture:delete", id),
    getByCommande: (commandeId: number) => ipcRenderer.invoke("facture:getByCommande", commandeId),
  },

pdf: {
  bonCommande: (commandeId: number) =>
    ipcRenderer.invoke("pdf:bonCommande", commandeId),
  bonLivraison: (livraisonId: number) =>
    ipcRenderer.invoke("pdf:bonLivraison", livraisonId),
  facture: (factureId: number) =>
    ipcRenderer.invoke("pdf:facture", factureId),
  },

  file: {
    openPath: (filePath: string) => ipcRenderer.invoke("file:openPath", filePath),
  },

});

