import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createClient } from '@supabase/supabase-js';

// Polyfill WebSocket for Node if not present
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  globalThis.WebSocket = class WebSocket {};
}

const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

/**
 * Defensive data normalization for product rows.
 * Guarantees fallbacks for name, item_code, category, packing, actual_price, and discount_price.
 */
function normalizeProduct(raw, index) {
  const rawName = String(raw.name || raw.item_name || raw.product_name || raw.title || '').trim();
  const name = rawName || `Ayyan Special Cracker #${index + 1}`;

  const rawCode = String(raw.item_code || raw.code || raw.sku || raw.product_code || '').trim();
  const idDigits = raw.id ? String(raw.id).replace(/\D/g, '').slice(-3) : '';
  const item_code = rawCode || idDigits || String(index + 1).padStart(3, '0');

  const rawCat = String(raw.category || raw.category_name || raw.group || raw.type || '').trim();
  const category = rawCat || 'Sivakasi Sparklers & Crackers';

  const rawPack = String(raw.packing || raw.piece_count || raw.unit || raw.pack_size || '').trim();
  const packing = rawPack || '1 Box';

  const parsedDiscount = parseFloat(String(raw.discount_price ?? raw.price ?? raw.sale_price ?? raw.rate ?? '0'));
  const discount_price = !isNaN(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : 50;

  const parsedActual = parseFloat(String(raw.actual_price ?? raw.mrp ?? raw.regular_price ?? raw.original_price ?? '0'));
  let actual_price = !isNaN(parsedActual) && parsedActual > 0 ? parsedActual : 0;
  if (actual_price <= discount_price) {
    actual_price = Math.round(discount_price * 1.25);
  }

  return {
    index: index + 1,
    item_code,
    name,
    category,
    packing,
    actual_price,
    discount_price,
    actual_price_formatted: `₹${actual_price.toFixed(2)}`,
    discount_price_formatted: `₹${discount_price.toFixed(2)}`
  };
}

function filterAndNormalizeProducts(rawList) {
  if (!Array.isArray(rawList)) return [];

  const validEntries = rawList.filter(item => {
    if (!item || typeof item !== 'object') return false;
    return Boolean(
      item.name || item.item_name || item.product_name || item.title ||
      item.code || item.item_code || item.sku || item.id ||
      item.price !== undefined || item.actual_price !== undefined || item.rate !== undefined
    );
  });

  return validEntries.map((item, idx) => normalizeProduct(item, idx));
}

async function fetchAllProductsFromSupabase() {
  const PAGE_SIZE = 1000;
  let allRecords = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const to = from + PAGE_SIZE - 1;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .range(from, to)
        .order('id', { ascending: true });

      if (error) {
        console.warn(`[Supabase Fetch] Error range [${from}..${to}]:`, error.message);
        break;
      }

      if (Array.isArray(data) && data.length > 0) {
        allRecords = allRecords.concat(data);
        if (data.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          from += PAGE_SIZE;
        }
      } else {
        hasMore = false;
      }
    } catch (e) {
      console.warn('[Supabase Fetch] Exception:', e.message);
      break;
    }
  }

  return allRecords;
}

function loadInitialProductsFallback() {
  const initialDataPath = path.resolve(process.cwd(), 'src/lib/initialData.ts');
  const content = fs.readFileSync(initialDataPath, 'utf8');

  // Try parsing JSON block
  const match = content.match(/export const INITIAL_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*\n/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {}
  }

  // Regex fallback
  const itemRegex = /{\s*"id":\s*"([^"]+)",\s*"code":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"price":\s*([0-9.]+),\s*"piece_count":\s*"([^"]+)"/g;
  const items = [];
  let m;
  while ((m = itemRegex.exec(content)) !== null) {
    items.push({
      id: m[1],
      code: m[2],
      name: m[3],
      category: m[4],
      price: parseFloat(m[5]),
      piece_count: m[6]
    });
  }
  return items;
}

export function buildPdf(products) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 12;
  const marginRight = 12;

  const tableRows = products.map(p => [
    p.item_code,
    p.name,
    p.category,
    p.packing,
    p.actual_price_formatted,
    p.discount_price_formatted
  ]);

  autoTable(doc, {
    head: [['CODE', 'ITEM DESCRIPTION', 'CATEGORY', 'PACKING', 'MRP (₹)', 'PRICE (₹)']],
    body: tableRows,
    startY: 36,
    margin: { top: 36, left: marginLeft, right: marginRight, bottom: 18 },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      valign: 'middle',
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [251, 191, 36],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 2.8,
      lineWidth: 0.2,
      lineColor: [245, 158, 11]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center', fontStyle: 'bold', textColor: [71, 85, 105] },
      1: { cellWidth: 68, halign: 'left', fontStyle: 'bold', textColor: [15, 23, 42], overflow: 'linebreak' },
      2: { cellWidth: 36, halign: 'left', textColor: [71, 85, 105] },
      3: { cellWidth: 26, halign: 'center', textColor: [100, 116, 139] },
      4: { cellWidth: 20, halign: 'right', textColor: [148, 163, 184], fontStyle: 'normal' },
      5: { cellWidth: 20, halign: 'right', textColor: [180, 83, 9], fontStyle: 'bold' }
    },
    didDrawPage: () => {
      // Top Festive Gold Accent Bar
      doc.setFillColor(245, 158, 11);
      doc.rect(0, 0, pageWidth, 4, 'F');

      // Top Title Bar
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12.5);
      doc.setTextColor(15, 23, 42);
      doc.text('AYYAN FIREWORKS (BUNNY BRAND) — SIVAKASI', marginLeft, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Official Wholesale & Showroom Price List 2026 • Visakhapatnam Flagship Store', marginLeft, 16);

      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      doc.text('100% Genuine Sivakasi Green Crackers • Certified Low-Emission Formulations • Supreme Court Compliant', marginLeft, 21);

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('NH-16, Sheela Nagar, Visakhapatnam - 530012 | Helpline: +91 77299 92125 | Website: vizagayyan.com', marginLeft, 25.5);

      // Gold Header Divider
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, 29, pageWidth - marginRight, 29);

      // Bottom Footer Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, pageHeight - 12, pageWidth - marginRight, pageHeight - 12);

      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184);
      doc.text('Ayyan Fireworks Official Price List • In-Store Purchase Only • All Prices in INR Inclusive of Applicable Taxes', marginLeft, pageHeight - 7);
    }
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageStr = `Page ${i} of ${totalPages}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const strWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, pageWidth - marginRight - strWidth, pageHeight - 7);
  }

  return doc;
}

async function main() {
  console.log('Fetching products for Ayyan_Fireworks_PriceList_2026.pdf...');

  let rawProducts = [];
  try {
    rawProducts = await fetchAllProductsFromSupabase();
  } catch (err) {
    console.warn('Supabase fetch failed, will use fallback:', err.message);
  }

  const initialProducts = loadInitialProductsFallback();

  if (!rawProducts || rawProducts.length === 0) {
    rawProducts = initialProducts;
  } else if (rawProducts.length < initialProducts.length) {
    const existingCodes = new Set(rawProducts.map(p => String(p.code || p.item_code || '').trim()));
    const missing = initialProducts.filter(p => !existingCodes.has(String(p.code).trim()));
    rawProducts = rawProducts.concat(missing);
  }

  console.log(`Raw inventory count: ${rawProducts.length}`);

  const normalized = filterAndNormalizeProducts(rawProducts);
  console.log(`Normalized valid products: ${normalized.length}`);

  const doc = buildPdf(normalized);
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  const outPath = path.resolve(process.cwd(), 'public/Ayyan_Fireworks_PriceList_2026.pdf');
  fs.writeFileSync(outPath, pdfBuffer);

  const totalPages = doc.getNumberOfPages();
  console.log(`✅ Successfully generated: ${outPath}`);
  console.log(`📄 Total Pages: ${totalPages}`);
  console.log(`📦 Product Rows: ${normalized.length}`);
}

main().catch(err => {
  console.error('PDF generation error:', err);
  process.exit(1);
});
