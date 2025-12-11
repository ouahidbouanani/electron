import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import "./db";

import { productRepository } from "./repositories/productRepository";
import { categoryRepository } from "./repositories/categoryRepository";
import { clientRepository } from "./repositories/clientRepository";
import { orderRepository } from "./repositories/orderRepository";
import { orderLineRepository } from "./repositories/orderLineRepository";

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

/* ----------- LIFECYCLE ----------- */
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
