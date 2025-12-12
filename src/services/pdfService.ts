import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateOrderPDF(order: any, filePath?: string) {
  const doc = new PDFDocument();

  const outputPath = filePath ?? path.join(__dirname, `order_${order.id}.pdf`);
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text(`Bon de commande #${order.id}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).text(`Client: ${order.clientName}`);
  doc.text(`Date: ${order.date}`);
  doc.moveDown();

  doc.text('Produits:');
  order.lines.forEach((line: any) => {
    doc.text(`- ${line.productName} x${line.quantite} : ${line.prix} €`);
  });

  doc.text(`Total: ${order.total} €`, { align: 'right' });

  doc.end();

  return new Promise<string>((resolve, reject) => {
    doc.on('finish', () => resolve(outputPath));
    doc.on('error', reject);
  });
}

export async function generateShipmentPDF(shipment: any, filePath?: string) {
  const doc = new PDFDocument();

  const outputPath = filePath ?? path.join(__dirname, `shipment_${shipment.id}.pdf`);
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text(`Bon de livraison #${shipment.id}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).text(`Commande: ${shipment.commandeId}`);
  doc.text(`Date de livraison: ${shipment.dateLivraison}`);
  doc.text(`Statut: ${shipment.statut}`);
  doc.end();

  return new Promise<string>((resolve, reject) => {
    doc.on('finish', () => resolve(outputPath));
    doc.on('error', reject);
  });
}
