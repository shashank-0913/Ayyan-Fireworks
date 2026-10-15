import fs from 'fs';
import path from 'path';
import { generateCompleteCatalogPdf, filterAndNormalizeProducts } from '../src/services/catalogPdfGenerator';
import { INITIAL_PRODUCTS } from '../src/lib/initialData';

async function main() {
  console.log('================================================================');
  console.log('AYYAN FIREWORKS — HIGH-RESOLUTION CATALOG PDF GENERATOR');
  console.log('================================================================');

  const doc = await generateCompleteCatalogPdf();
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  const outputPath = path.resolve(process.cwd(), 'public/Ayyan_Fireworks_PriceList_2026.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);

  const totalPages = doc.getNumberOfPages();
  console.log(`✅ Successfully generated: ${outputPath}`);
  console.log(`📊 Size: ${pdfBuffer.length} bytes`);
  console.log(`📄 Total Pages: ${totalPages}`);
  console.log(`📦 Master Products Count: ${INITIAL_PRODUCTS.length}`);
  console.log('================================================================');
}

main().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
