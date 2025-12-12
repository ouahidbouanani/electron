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
    add: (data: any) => ipcRenderer.invoke("fournisseur:add", data),
    delete: (id: number) => ipcRenderer.invoke("fournisseur:delete", id),
  },
   shipment: {
    add: (payload: any) => ipcRenderer.invoke("livraison:add", payload),
    getByCommande: (commandeId: number) => ipcRenderer.invoke("livraison:getByCommande", commandeId),
    update: (payload: any) => ipcRenderer.invoke("livraison:update", payload),
    delete: (id: number) => ipcRenderer.invoke("livraison:delete", id),
  },
  pdf: {
  bonCommande: (commandeId: number) =>
    ipcRenderer.invoke("pdf:bonCommande", commandeId),
  bonLivraison: (livraisonId: number) =>
    ipcRenderer.invoke("pdf:bonLivraison", livraisonId),
}

});

