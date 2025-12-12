import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import "./db";
import PDFDocument from "pdfkit";
import fs from "fs";

import { productRepository } from "./repositories/productRepository";
import { categoryRepository } from "./repositories/categoryRepository";
import { clientRepository } from "./repositories/clientRepository";
import { orderRepository } from "./repositories/orderRepository";
import { orderLineRepository } from "./repositories/orderLineRepository";
import { supplierRepository } from "./repositories/supplierRepository";
import { shipmentRepository } from "./repositories/shipmentRepository";

const isDev = process.env.NODE_ENV === "development";
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/* ----------- PRODUIT ----------- */
ipcMain.handle("produit:getAll", async () => {
  return await productRepository.getAll();
});

ipcMain.handle("produit:getById", async (_e, id: number) => {
  return await productRepository.getById(id);
});

ipcMain.handle("produit:add", async (_e, data) => {
  const id = await productRepository.add(data);
  return { id };
});

ipcMain.handle("produit:update", async (_e, data) => {
  await productRepository.update(data);
});

ipcMain.handle("produit:delete", async (_e, id: number) => {
  await productRepository.delete(id);
});

ipcMain.handle('produit:getByCategory', async (_, categoryId: number) => {
  return await productRepository.getByCategory(categoryId);
});


/* ----------- CATEGORY ----------- */
ipcMain.handle("category:getAll", async () => {
  return await categoryRepository.getAll();
});

ipcMain.handle("category:add", async (_e, data) => {
  const id = await categoryRepository.add(data);
  return { id };
});

ipcMain.handle("category:update", async (_e, data) => {
  await categoryRepository.update(data);
});

ipcMain.handle("category:delete", async (_e, id: number) => {
  await categoryRepository.delete(id);
});

/* ----------- CLIENT ----------- */
ipcMain.handle("client:getAll", async () => {
  return await clientRepository.getAll();
});

ipcMain.handle("client:getById", async (_e, id: number) => {
  return await clientRepository.getById(id);
});

ipcMain.handle("client:add", async (_e, data) => {
  const id = await clientRepository.add(data);
  return { id };
});

ipcMain.handle("client:update", async (_e, data) => {
  await clientRepository.update(data);
});

ipcMain.handle("client:delete", async (_e, id: number) => {
  await clientRepository.delete(id);
});

/* ----------- COMMANDE ----------- */
ipcMain.handle("commande:getAll", async () => {
  return await orderRepository.getAll();
});

ipcMain.handle("commande:getById", async (_e, id: number) => {
  return await orderRepository.getById(id);
});

ipcMain.handle("commande:add", async (_e, data) => {
  const id = await orderRepository.add(data);
  return { id };
});

ipcMain.handle("commande:update", async (_e, data) => {
  await orderRepository.update(data);
});

ipcMain.handle("commande:delete", async (_e, id: number) => {
  // on supprime d'abord les lignes, puis la commande
  await orderLineRepository.deleteByCommande(id);
  await orderRepository.delete(id);
});

/* ----------- COMMANDE LIGNE ----------- */
ipcMain.handle(
  "commandeLigne:getByCommande",
  async (_e, commandeId: number) => {
    return await orderLineRepository.getByCommande(commandeId);
  }
);

ipcMain.handle("commandeLigne:add", async (_e, data) => {
  const id = await orderLineRepository.add(data);
  return { id };
});

ipcMain.handle("commandeLigne:delete", async (_e, id: number) => {
  await orderLineRepository.delete(id);
});

/*----------- FOURNISSEUR ----------- */
ipcMain.handle("fournisseur:getAll", async () => {
  return await supplierRepository.getAll();
});

ipcMain.handle("fournisseur:add", async (_, data) => {
  return await supplierRepository.add(data);
});

ipcMain.handle("fournisseur:delete", async (_, id) => {
  return await supplierRepository.delete(id);
});


ipcMain.handle("livraison:add", async (_, payload) => {
  return await shipmentRepository.add(payload);
});

ipcMain.handle("livraison:getByCommande", async (_, commandeId) => {
  return await shipmentRepository.getByCommande(commandeId);
});

ipcMain.handle("livraison:update", async (_, payload) => {
  return await shipmentRepository.update(payload);
});

ipcMain.handle("livraison:delete", async (_, id) => {
  return await shipmentRepository.delete(id);
});
ipcMain.handle("livraison:getAll", async () => {
  return await shipmentRepository.getAll();
});
/* ----------- PDF BON DE COMMANDE GENERATION ----------- */

// Bon de commande
ipcMain.handle("pdf:bonCommande", async (_, commandeId: number) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `bon_commande_${commandeId}.pdf`);
  
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("Bon de Commande", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Commande n° : ${commandeId}`);
  doc.text(`Date : ${new Date().toLocaleDateString()}`);

  doc.moveDown().fontSize(16).text("Détails :", { underline: true });

  // ─── CHARGE LES DONNÉES DEPUIS  DB ───────────
  const commande = await orderRepository.getById(commandeId);
  const lignes = await orderLineRepository.getByCommande(commandeId);

  lignes.forEach(l => {
    doc.fontSize(14).text(`• ${l.product_name} x ${l.quantite} – ${l.prix} €`);
  });

  doc.end();
  return filePath;
});



/* ----------- PDF BON DE LIVRAISON GENERATION ----------- */
ipcMain.handle("pdf:bonLivraison", async (_, livraisonId: number) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `bon_livraison_${livraisonId}.pdf`);

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("Bon de Livraison", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Livraison n° : ${livraisonId}`);

  const livraison = await shipmentRepository.getById(livraisonId);
  if (!livraison) {
  console.error("Livraison introuvable !");
  return;
 }
  const commande = await orderRepository.getById(livraison.commande_id);
if (!commande) {
  console.error("Commande introuvable");
  return;
}
  doc.text(`Commande liée : #${commande.id}`);
  doc.text(`Client : ${commande.client_id}`);
  doc.text(`Statut : ${livraison.statut}`);
  doc.text(`Date livraison : ${livraison.date_livraison}`);

  doc.end();
  return filePath;
});


/* ----------- LIFECYCLE ----------- */
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
