import fs from 'fs';
import path from 'path';

function escapePdfText(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildPdf(products) {
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const itemsPerPage = 28;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pagesData = [];

  for (let p = 0; p < totalPages; p++) {
    const pageItems = products.slice(p * itemsPerPage, (p + 1) * itemsPerPage);
    let stream = '';

    // Header Background banner
    stream += '0.96 0.62 0.04 rg\n'; // Amber/Gold color
    stream += `0 ${pageHeight - 60} ${pageWidth} 60 re\nf\n`;

    // Header Title
    stream += 'BT\n';
    stream += '/F2 16 Tf\n';
    stream += '0 0 0 rg\n'; // Black text
    stream += `30 ${pageHeight - 32} Td\n`;
    stream += '(AYYAN FIREWORKS (BUNNY BRAND) - SIVAKASI) Tj\n';
    stream += 'ET\n';

    // Subtitle
    stream += 'BT\n';
    stream += '/F1 10 Tf\n';
    stream += '0.1 0.1 0.1 rg\n';
    stream += `30 ${pageHeight - 48} Td\n`;
    stream += `(Official Showroom Price List 2026 - Visakhapatnam Flagship Store | Page ${p + 1} of ${totalPages}) Tj\n`;
    stream += 'ET\n';

    // Table Header
    const tableTop = pageHeight - 85;
    stream += '0.92 0.94 0.96 rg\n'; // light gray
    stream += `30 ${tableTop - 18} ${pageWidth - 60} 22 re\nf\n`;

    // Table Header text
    stream += 'BT\n';
    stream += '/F2 9 Tf\n';
    stream += '0.2 0.2 0.2 rg\n';
    stream += `38 ${tableTop - 13} Td (CODE) Tj\n`;
    stream += `85 ${tableTop - 13} Td (PRODUCT NAME) Tj\n`;
    stream += `290 ${tableTop - 13} Td (CATEGORY) Tj\n`;
    stream += `405 ${tableTop - 13} Td (PACKING) Tj\n`;
    stream += `485 ${tableTop - 13} Td (PRICE) Tj\n`;
    stream += 'ET\n';

    // Rows
    let currentY = tableTop - 34;
    pageItems.forEach((item, idx) => {
      // Row alternating zebra background
      if (idx % 2 === 0) {
        stream += '0.98 0.98 0.99 rg\n';
        stream += `30 ${currentY - 4} ${pageWidth - 60} 18 re\nf\n`;
      }

      // Divider line
      stream += '0.88 0.90 0.92 RG\n';
      stream += '0.5 w\n';
      stream += `30 ${currentY - 4} m ${pageWidth - 30} ${currentY - 4} l S\n`;

      const code = escapePdfText(item.code || String(idx + 1).padStart(3, '0'));
      const name = escapePdfText(item.name.length > 32 ? item.name.substring(0, 30) + '..' : item.name);
      const cat = escapePdfText(item.category || 'General');
      const pack = escapePdfText(item.piece_count || '1 Box');
      const price = `Rs. ${Number(item.price).toFixed(2)}`;

      stream += 'BT\n';
      stream += '/F1 8.5 Tf\n';
      stream += '0.15 0.15 0.15 rg\n';
      stream += `38 ${currentY} Td (${code}) Tj\n`;
      stream += `85 ${currentY} Td (${name}) Tj\n`;
      stream += `290 ${currentY} Td (${cat}) Tj\n`;
      stream += `405 ${currentY} Td (${pack}) Tj\n`;
      stream += 'ET\n';

      // Price in Bold
      stream += 'BT\n';
      stream += '/F2 8.5 Tf\n';
      stream += '0.7 0.3 0 rg\n';
      stream += `485 ${currentY} Td (${escapePdfText(price)}) Tj\n`;
      stream += 'ET\n';

      currentY -= 22;
    });

    // Footer
    stream += '0.88 0.90 0.92 RG\n';
    stream += '0.5 w\n';
    stream += `30 35 m ${pageWidth - 30} 35 l S\n`;

    stream += 'BT\n';
    stream += '/F1 7.5 Tf\n';
    stream += '0.45 0.45 0.45 rg\n';
    stream += `30 22 Td (Ayyan Fireworks Flagship Showroom: Main Road / NH-16, Sheela Nagar, Visakhapatnam - 530012 | WhatsApp: +91 77299 92125 | Website: vizagayyan.com) Tj\n`;
    stream += 'ET\n';

    pagesData.push(stream);
  }

  // Assemble PDF document objects
  const objects = [];
  const byteOffsets = [];
  let offset = 0;

  function write(str) {
    objects.push(str);
    offset += Buffer.byteLength(str, 'binary');
  }

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  write(header);

  // Object 1: Catalog
  byteOffsets[1] = offset;
  write('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Object 2: Pages
  // IDs: Page 1 is 5, content 1 is 6, Page 2 is 7, content 2 is 8, etc.
  const pageKids = [];
  for (let i = 0; i < totalPages; i++) {
    pageKids.push(`${5 + i * 2} 0 R`);
  }

  byteOffsets[2] = offset;
  write(`2 0 obj\n<< /Type /Pages /Kids [${pageKids.join(' ')}] /Count ${totalPages} >>\nendobj\n`);

  // Object 3: Font Helvetica
  byteOffsets[3] = offset;
  write('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n');

  // Object 4: Font Helvetica-Bold
  byteOffsets[4] = offset;
  write('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n');

  // Page Objects and Content Streams
  for (let i = 0; i < totalPages; i++) {
    const pageObjId = 5 + i * 2;
    const contentObjId = 6 + i * 2;
    const contentStream = pagesData[i];
    const streamLen = Buffer.byteLength(contentStream, 'binary');

    // Page object
    byteOffsets[pageObjId] = offset;
    write(`${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`);

    // Content stream object
    byteOffsets[contentObjId] = offset;
    write(`${contentObjId} 0 obj\n<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream\nendobj\n`);
  }

  // Cross-reference table
  const xrefOffset = offset;
  const totalObjCount = 5 + totalPages * 2;
  write(`xref\n0 ${totalObjCount}\n`);
  write('0000000000 65535 f \n');
  for (let i = 1; i < totalObjCount; i++) {
    const offStr = String(byteOffsets[i]).padStart(10, '0');
    write(`${offStr} 00000 n \n`);
  }

  // Trailer
  write(`trailer\n<< /Size ${totalObjCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return Buffer.concat(objects.map(s => Buffer.from(s, 'binary')));
}

async function main() {
  console.log('Generating Ayyan_Fireworks_PriceList_2026.pdf...');

  // Extract products from src/lib/initialData.ts
  const initialDataPath = path.resolve(process.cwd(), 'src/lib/initialData.ts');
  const content = fs.readFileSync(initialDataPath, 'utf8');

  // Match JSON products in initialData
  const match = content.match(/export const INITIAL_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*\n/);
  let products = [];
  if (match) {
    try {
      products = JSON.parse(match[1]);
    } catch (e) {
      console.warn('Direct parse failed, extracting via eval-safe method...');
    }
  }

  if (!products || products.length === 0) {
    // Fallback: extract objects using regex
    const itemRegex = /{\s*"id":\s*"([^"]+)",\s*"code":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"price":\s*([0-9.]+),\s*"piece_count":\s*"([^"]+)"/g;
    let m;
    while ((m = itemRegex.exec(content)) !== null) {
      products.push({
        id: m[1],
        code: m[2],
        name: m[3],
        category: m[4],
        price: parseFloat(m[5]),
        piece_count: m[6]
      });
    }
  }

  console.log(`Found ${products.length} products to include in PDF.`);

  const pdfBuffer = buildPdf(products);
  const outPath = path.resolve(process.cwd(), 'public/Ayyan_Fireworks_PriceList_2026.pdf');
  fs.writeFileSync(outPath, pdfBuffer);

  console.log(`✅ Successfully generated ${outPath} (${pdfBuffer.length} bytes, ~${Math.ceil(products.length / 28)} pages)`);
}

main().catch(console.error);
