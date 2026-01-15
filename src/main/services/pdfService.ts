// electron/services/pdfService.ts
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

import { orderLineRepository } from "../repositories/orderLineRepository";
import { shipmentRepository } from "../repositories/shipmentRepository";
import { orderRepository } from "../repositories/orderRepository";
import { factureRepository } from "../repositories/factureRepository";

function pdfPath(fileName: string) {
  return path.join(process.cwd(), "pdf", fileName);
}

function ensurePdfDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function moneyEUR(v: number) {
  // ton style exemple utilise "€", je garde EUR (tu peux switch)
  return `${Number(v ?? 0).toFixed(2)} €`;
}

function safeDateFR(d: any) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString("fr-FR");
}

/** ====== CADRE SIGNATURES (même style que ton exemple) ====== */
function drawSignaturesBox(
  doc: PDFKit.PDFDocument,
  color: string,
  leftLabel: string,
  rightLabel: string
) {
  const boxTop = doc.y + 20;
  const boxHeight = 120;

  // Cadre
  doc
    .rect(40, boxTop, 520, boxHeight)
    .strokeColor(color)
    .lineWidth(1)
    .stroke();

  // Signature gauche
  doc.fontSize(14).fillColor("black").font("Helvetica");
  doc.text(leftLabel, 60, boxTop + 20);

  doc
    .moveTo(60, boxTop + 60)
    .lineTo(260, boxTop + 60)
    .strokeColor("#000000")
    .stroke();

  // Signature droite
  doc.text(rightLabel, 320, boxTop + 20);

  doc
    .moveTo(320, boxTop + 60)
    .lineTo(520, boxTop + 60)
    .strokeColor("#000000")
    .stroke();

  doc.moveDown(8);
}

/** ====== PAGINATION SIMPLE (si beaucoup de lignes) ====== */
function ensureSpace(doc: PDFKit.PDFDocument, y: number, bottomReserve = 180) {
  const limit = doc.page.height - bottomReserve;
  if (y > limit) {
    doc.addPage();
    return 70;
  }
  return y;
}

/** ====== TABLE HEADER STYLE EXEMPLE ====== */
function drawOrderTableHeader(doc: PDFKit.PDFDocument, startY: number, color: string) {
  doc
    .fontSize(14)
    .fillColor(color)
    .font("Helvetica-Bold")
    .text("Produit", 50, startY)
    .text("Qté", 200, startY)
    .text("Prix", 300, startY)
    .text("Total", 400, startY);

  doc
    .moveTo(50, startY + 20)
    .lineTo(550, startY + 20)
    .strokeColor(color)
    .stroke();

  doc.font("Helvetica").fontSize(12).fillColor("black");
}

function drawShipmentTableHeader(doc: PDFKit.PDFDocument, startY: number, color: string) {
  doc
    .fontSize(14)
    .fillColor(color)
    .font("Helvetica-Bold")
    .text("Produit", 50, startY)
    .text("Quantité", 350, startY);

  doc
    .moveTo(50, startY + 20)
    .lineTo(550, startY + 20)
    .strokeColor(color)
    .stroke();

  doc.font("Helvetica").fontSize(12).fillColor("black");
}

/** =========================
 *  SERVICE
 *  ========================= */
export const pdfService = {
  /** ===== BON DE COMMANDE (style exact) ===== */
  async bonCommande(commandeId: number) {
    const filePath = pdfPath(`bon_commande_${commandeId}.pdf`);
    ensurePdfDir(filePath);

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const color = "#003366";

    // ===== TITRE =====
    doc.fontSize(26).fillColor(color).text("BON DE COMMANDE", { align: "center" });
    doc.moveDown(2);

    // ===== INFOS =====
    const commande = await orderRepository.getById(commandeId);

    doc.fillColor("black").fontSize(12).font("Helvetica");
    doc.text(`Commande n° : ${commandeId}`);
    doc.text(`Client : ${commande?.client_id ?? "-"}`);
    doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`);
    doc.moveDown(2);

    // ===== TABLEAU =====
    const lignes = await orderLineRepository.getByCommande(commandeId);

    let startY = doc.y;
    drawOrderTableHeader(doc, startY, color);

    let y = startY + 30;

    for (const l of lignes) {
      y = ensureSpace(doc, y);

      const prix = Number(l.prix ?? 0);
      const qte = Number(l.quantite ?? 0);
      const totalLigne = qte * prix;

      doc.text(l.product_name ?? "Produit inconnu", 50, y);
      doc.text(qte.toString(), 200, y);
      doc.text(moneyEUR(prix), 300, y);
      doc.text(moneyEUR(totalLigne), 400, y);

      doc
        .moveTo(50, y + 18)
        .lineTo(550, y + 18)
        .strokeColor("#cccccc")
        .stroke();

      y += 25;
    }

    doc.moveDown(3);

    // ===== TOTAL GÉNÉRAL =====
    const totalCmd = lignes.reduce(
      (acc, l) => acc + Number(l.prix ?? 0) * Number(l.quantite ?? 0),
      0
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(color)
      .text(`TOTAL : ${moneyEUR(totalCmd)}`, { align: "right" });

    doc.moveDown(3);

    // ===== SIGNATURES =====
    drawSignaturesBox(doc, color, "Signature du client :", "Signature du fournisseur :");

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    return filePath;
  },

  /** ===== BON DE LIVRAISON (style exact) ===== */
  async bonLivraison(livraisonId: number) {
    const filePath = pdfPath(`bon_livraison_${livraisonId}.pdf`);
    ensurePdfDir(filePath);

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const color = "#1e3a8a";

    // ===== TITRE =====
    doc
      .fontSize(26)
      .fillColor(color)
      .font("Helvetica-Bold")
      .text("BON DE LIVRAISON", { align: "center" });

    doc.moveDown(2);

    const livraison = await shipmentRepository.getById(livraisonId);

    // ===== INFOS =====
    doc.fillColor("black").fontSize(12).font("Helvetica");

    if (!livraison) {
      doc.text(`Livraison n° : ${livraisonId}`);
      doc.moveDown(2);
      doc.text("Livraison introuvable.");
      doc.end();

      await new Promise<void>((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      return filePath;
    }

    doc.text(`Livraison n° : ${livraisonId}`);
    doc.text(`Commande liée : ${livraison.commande_id}`);
    doc.text(`Date de livraison : ${livraison.date_livraison ?? "-"}`);
    doc.text(`Statut : ${livraison.statut ?? "-"}`);
    doc.moveDown(2);

    // ===== TABLEAU =====
    const startY = doc.y;
    drawShipmentTableHeader(doc, startY, color);

    let y = startY + 30;

    const lines = await orderLineRepository.getByCommande(livraison.commande_id);

    for (const line of lines) {
      y = ensureSpace(doc, y);

      doc.text(line.product_name ?? "Produit inconnu", 50, y);
      doc.text((line.quantite ?? 0).toString(), 350, y);

      doc
        .moveTo(50, y + 18)
        .lineTo(550, y + 18)
        .strokeColor("#cccccc")
        .stroke();

      y += 25;
    }

    doc.moveDown(3);

    // ===== SIGNATURES =====
    drawSignaturesBox(doc, color, "Signature du client :", "Signature du livreur :");

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    return filePath;
  },

  /** ===== FACTURE (même style exact + total) ===== */
  async facture(factureId: number) {
    const filePath = pdfPath(`facture_${factureId}.pdf`);
    ensurePdfDir(filePath);

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const color = "#003366"; // tu peux mettre une autre couleur si tu veux

    const facture = await factureRepository.getById(factureId);

    // ===== TITRE =====
    doc.fontSize(26).fillColor(color).font("Helvetica-Bold").text("FACTURE", { align: "center" });
    doc.moveDown(2);

    // ===== INFOS =====
    doc.fillColor("black").fontSize(12).font("Helvetica");

    if (!facture) {
      doc.text(`Facture n° : ${factureId}`);
      doc.moveDown(2);
      doc.text("Facture introuvable.");
      doc.end();

      await new Promise<void>((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      return filePath;
    }

    doc.text(`Facture n° : ${facture.numero}`);
    doc.text(`Commande : ${facture.commande_id}`);
    doc.text(`Date : ${safeDateFR(facture.date)}`);
    doc.text(`Statut : ${facture.statut ?? "EMISE"}`);
    doc.moveDown(2);

    // ===== TABLEAU (on réutilise le tableau type "commande") =====
    const startY = doc.y;
    drawOrderTableHeader(doc, startY, color);

    let y = startY + 30;

    const lignes = await orderLineRepository.getByCommande(facture.commande_id);

    for (const l of lignes) {
      y = ensureSpace(doc, y);

      const prix = Number(l.prix ?? 0);
      const qte = Number(l.quantite ?? 0);
      const totalLigne = qte * prix;

      doc.text(l.product_name ?? "Produit inconnu", 50, y);
      doc.text(qte.toString(), 200, y);
      doc.text(moneyEUR(prix), 300, y);
      doc.text(moneyEUR(totalLigne), 400, y);

      doc
        .moveTo(50, y + 18)
        .lineTo(550, y + 18)
        .strokeColor("#cccccc")
        .stroke();

      y += 25;
    }

    doc.moveDown(3);

    // ===== TOTAL FACTURE =====
    const totalFacture = Number(facture.total ?? 0);

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(color)
      .text(`TOTAL : ${moneyEUR(totalFacture)}`, { align: "right" });

    doc.moveDown(3);

    // ===== SIGNATURES =====
    drawSignaturesBox(doc, color, "Signature du client :", "Signature du fournisseur :");

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    return filePath;
  },
};
