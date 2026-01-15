import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import "./db";

import { productRepository } from "./repositories/productRepository";
import { categoryRepository } from "./repositories/categoryRepository";
import { clientRepository } from "./repositories/clientRepository";
import { orderRepository } from "./repositories/orderRepository";
import { orderLineRepository } from "./repositories/orderLineRepository";
import { supplierRepository } from "./repositories/supplierRepository";
import { shipmentRepository } from "./repositories/shipmentRepository";
import { factureRepository } from "./repositories/factureRepository";
import { userRepository } from "./repositories/userRepository";

import { pdfService } from "./services/pdfService";

const isDev = process.env.NODE_ENV === "development";
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/* -------------------- PRODUIT -------------------- */
ipcMain.handle("produit:getAll", async () => productRepository.getAll());
ipcMain.handle("produit:getById", async (_e, id: number) => productRepository.getById(id));
ipcMain.handle("produit:add", async (_e, data) => ({ id: await productRepository.add(data) }));
ipcMain.handle("produit:update", async (_e, data) => productRepository.update(data));
ipcMain.handle("produit:delete", async (_e, id: number) => productRepository.delete(id));
ipcMain.handle("produit:getByCategory", async (_e, categoryId: number) =>
  productRepository.getByCategory(categoryId)
);

/* -------------------- CATEGORY -------------------- */
ipcMain.handle("category:getAll", async () => categoryRepository.getAll());
ipcMain.handle("category:add", async (_e, data) => ({ id: await categoryRepository.add(data) }));
ipcMain.handle("category:update", async (_e, data) => categoryRepository.update(data));
ipcMain.handle("category:delete", async (_e, id: number) => categoryRepository.delete(id));

/* -------------------- CLIENT -------------------- */
ipcMain.handle("client:getAll", async () => clientRepository.getAll());
ipcMain.handle("client:getById", async (_e, id: number) => clientRepository.getById(id));
ipcMain.handle("client:add", async (_e, data) => ({ id: await clientRepository.add(data) }));
ipcMain.handle("client:update", async (_e, data) => clientRepository.update(data));
ipcMain.handle("client:delete", async (_e, id: number) => clientRepository.delete(id));

/* -------------------- COMMANDE -------------------- */
ipcMain.handle("commande:getAll", async () => orderRepository.getAll());
ipcMain.handle("commande:getById", async (_e, id: number) => orderRepository.getById(id));
ipcMain.handle("commande:add", async (_e, data) => ({ id: await orderRepository.add(data) }));
ipcMain.handle("commande:update", async (_e, data) => orderRepository.update(data));
ipcMain.handle("commande:delete", async (_e, id: number) => {
  await orderLineRepository.deleteByCommande(id);
  await orderRepository.delete(id);
});

/* -------------------- COMMANDE LIGNE -------------------- */
ipcMain.handle("commandeLigne:getByCommande", async (_e, commandeId: number) =>
  orderLineRepository.getByCommande(commandeId)
);
ipcMain.handle("commandeLigne:add", async (_e, data) => ({ id: await orderLineRepository.add(data) }));
ipcMain.handle("commandeLigne:delete", async (_e, id: number) => orderLineRepository.delete(id));

/* -------------------- FOURNISSEUR -------------------- */
ipcMain.handle("fournisseur:getAll", async () => supplierRepository.getAll());
ipcMain.handle("fournisseur:getById", async (_e, id: number) => supplierRepository.getById(id));
ipcMain.handle("fournisseur:add", async (_e, data) => ({ id: await supplierRepository.add(data) }));
ipcMain.handle("fournisseur:update", async (_e, data) => supplierRepository.update(data));
ipcMain.handle("fournisseur:delete", async (_e, id: number) => supplierRepository.delete(id));

/* -------------------- LIVRAISON -------------------- */
ipcMain.handle("livraison:add", async (_e, payload) => ({ id: await shipmentRepository.add(payload) }));
ipcMain.handle("livraison:getAll", async () => shipmentRepository.getAll());
ipcMain.handle("livraison:getById", async (_e, id: number) => shipmentRepository.getById(id));
ipcMain.handle("livraison:getByCommande", async (_e, commandeId: number) =>
  shipmentRepository.getByCommande(commandeId)
);
ipcMain.handle("livraison:update", async (_e, payload) => shipmentRepository.update(payload));
ipcMain.handle("livraison:delete", async (_e, id: number) => shipmentRepository.delete(id));

/* -------------------- FACTURES -------------------- */
ipcMain.handle("facture:getAll", async () => factureRepository.getAll());
ipcMain.handle("facture:getById", async (_e, id: number) => factureRepository.getById(id));
ipcMain.handle("facture:add", async (_e, payload: any) => factureRepository.add(payload));
ipcMain.handle("facture:update", async (_e, payload: any) => {
  await factureRepository.update(payload);
  return true;
});
ipcMain.handle("facture:delete", async (_e, id: number) => {
  await factureRepository.remove(id);
  return true;
});
ipcMain.handle("facture:getByCommande", async (_e, commandeId: number) =>
  factureRepository.getByCommande(commandeId)
);

/* -------------------- AUTH -------------------- */
let currentUserId: number | null = null;

ipcMain.handle("auth:register", async (_e, payload) => {
  const id = await userRepository.createUser(payload);
  currentUserId = id;
  return await userRepository.findById(id);
});

ipcMain.handle("auth:login", async (_e, payload) => {
  const user = await userRepository.verifyLogin(payload);
  currentUserId = user.id;
  return user;
});

ipcMain.handle("auth:me", async () => {
  if (!currentUserId) return null;
  return await userRepository.findById(currentUserId);
});

ipcMain.handle("auth:logout", async () => {
  currentUserId = null;
  return true;
});

/* -------------------- PDF -------------------- */
/**
 * On envoie baseDir à pdfService pour stocker dans un endroit safe:
 * app.getPath("userData") est toujours writable en prod.
 */
const pdfBaseDir = () => path.join(app.getPath("userData"), "pdf");

ipcMain.handle("pdf:bonCommande", async (_e, commandeId: number) => {
  return pdfService.bonCommande(commandeId);
});

ipcMain.handle("pdf:bonLivraison", async (_e, livraisonId: number) => {
  return pdfService.bonLivraison(livraisonId);
});

ipcMain.handle("pdf:facture", async (_e, factureId: number) => {
  return pdfService.facture(factureId);
});

/* -------------------- OPEN FILE (OS) -------------------- */
ipcMain.handle("file:openPath", async (_e, filePath: string) => {
  // shell.openPath retourne "" si succès, sinon un message d'erreur
  return shell.openPath(filePath);
});

/* -------------------- LIFECYCLE -------------------- */
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
