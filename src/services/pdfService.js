"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderPDF = generateOrderPDF;
exports.generateShipmentPDF = generateShipmentPDF;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function generateOrderPDF(order, filePath) {
    const doc = new pdfkit_1.default();
    const outputPath = filePath ?? path_1.default.join(__dirname, `order_${order.id}.pdf`);
    doc.pipe(fs_1.default.createWriteStream(outputPath));
    doc.fontSize(20).text(`Bon de commande #${order.id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Client: ${order.clientName}`);
    doc.text(`Date: ${order.date}`);
    doc.moveDown();
    doc.text('Produits:');
    order.lines.forEach((line) => {
        doc.text(`- ${line.productName} x${line.quantite} : ${line.prix} €`);
    });
    doc.text(`Total: ${order.total} €`, { align: 'right' });
    doc.end();
    return new Promise((resolve, reject) => {
        doc.on('finish', () => resolve(outputPath));
        doc.on('error', reject);
    });
}
async function generateShipmentPDF(shipment, filePath) {
    const doc = new pdfkit_1.default();
    const outputPath = filePath ?? path_1.default.join(__dirname, `shipment_${shipment.id}.pdf`);
    doc.pipe(fs_1.default.createWriteStream(outputPath));
    doc.fontSize(20).text(`Bon de livraison #${shipment.id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Commande: ${shipment.commandeId}`);
    doc.text(`Date de livraison: ${shipment.dateLivraison}`);
    doc.text(`Statut: ${shipment.statut}`);
    doc.end();
    return new Promise((resolve, reject) => {
        doc.on('finish', () => resolve(outputPath));
        doc.on('error', reject);
    });
}
//# sourceMappingURL=pdfService.js.map