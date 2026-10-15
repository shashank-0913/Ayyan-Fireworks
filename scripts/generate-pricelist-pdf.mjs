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

const TELUGU_TO_ENGLISH_PAIRS = [
  ['గణేష్', 'Ganesh'],
  ['లక్ష్మీ', 'Lakshmi'],
  ['బెంగాల్ ప్రిన్స్', 'Bengal Prince'],
  ['హైడ్రో బాంబులు', 'Hydro Bombs'],
  ['హైడ్రో', 'Hydro'],
  ['ఆటం బాంబులు', 'Atom Bombs'],
  ['ఆటం', 'Atom'],
  ['మెగా డిజిటల్ బాంబు', 'Mega Digital Bomb'],
  ['మెగా', 'Mega'],
  ['డిజిటల్', 'Digital'],
  ['బుల్లెట్ బాంబులు', 'Bullet Bombs'],
  ['బుల్లెట్', 'Bullet'],
  ['కురువి', 'Kuruvi'],
  ['రైఫిల్', 'Rifle'],
  ['బాంబులు', 'Bombs'],
  ['బాంబు', 'Bomb'],
  ['సౌండ్', 'Sound'],
  ['టపాసులు', 'Crackers'],
  ['కాకరపువ్వొత్తులు', 'Sparklers'],
  ['మతాబులు', 'Colour Sparklers'],
  ['ఆకుపచ్చ', 'Green'],
  ['ఎరుపు', 'Red'],
  ['రంగుల', 'Colour'],
  ['ఎలక్ట్రిక్', 'Electric'],
  ['భూచక్రాలు', 'Ground Chakkars'],
  ['స్పెషల్', 'Special'],
  ['డీలక్స్', 'Deluxe'],
  ['అశోక', 'Asoka'],
  ['పెద్ద', 'Big'],
  ['విష్ణు', 'Vishnu'],
  ['చక్రాలు', 'Chakkars'],
  ['వీల్', 'Wheel'],
  ['చిచ్చుబుడ్లు', 'Flower Pots'],
  ['జెయింట్', 'Giant'],
  ['కోటి', 'Koti Pots'],
  ['ఫౌంటెన్', 'Fountain'],
  ['మయూరి', 'Peacock'],
  ['పీకాక్', 'Peacock'],
  ['ట్రిపుల్', 'Triple'],
  ['జాదుగర్', 'Jadugar'],
  ['రాకెట్లు', 'Rockets'],
  ['రాకెట్', 'Rocket'],
  ['విజిలింగ్', 'Whistling'],
  ['లూనార్', 'Lunar'],
  ['బాణసంచా', 'Aerial Display'],
  ['షాట్స్', 'Shots'],
  ['కేక్', 'Cake'],
  ['రాయల్', 'Royal'],
  ['స్పెక్టాకిల్', 'Spectacle'],
  ['స్పార్క్లర్', 'Sparkler'],
  ['స్పార్క్లర్స్', 'Sparklers'],
  ['మ్యాచ్ బాక్స్', 'Match Box'],
  ['పాప్-పాప్', 'Pop-Pops'],
  ['ట్వింక్లింగ్', 'Twinkling'],
  ['హెలికాప్టర్', 'Helicopter'],
  ['డ్రోన్', 'Drone'],
  ['పాము బిళ్ళలు', 'Snake Eggs'],
  ['గిఫ్ట్ బాక్స్', 'Gift Box'],
  ['గిఫ్ట్', 'Gift'],
  ['బాక్స్', 'Box'],
  ['హ్యాంపర్', 'Hamper'],
  ['కిడ్స్', 'Kids'],
  ['సెలబ్రేషన్', 'Celebration'],
  ['హరిత', 'Green Cracker'],
  ['సెం.మీ', 'cm']
];

function sanitizeTextForPdf(input) {
  if (input === null || input === undefined) return '';
  let str = String(input).trim();
  if (!str) return '';

  if (/[\u0C00-\u0C7F]/.test(str)) {
    for (const [tel, eng] of TELUGU_TO_ENGLISH_PAIRS) {
      if (str.includes(tel)) {
        str = str.split(tel).join(eng);
      }
    }
    str = str.replace(/[\u0C00-\u0C7F]+/g, ' ');
  }

  str = str
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');

  str = str.replace(/[^\x20-\x7E\u00A0-\u00FF]/g, ' ');
  str = str.replace(/\s+/g, ' ').trim();

  return str;
}

/**
 * Defensive data normalization for product rows.
 * Guarantees fallbacks for name, item_code, category, packing, actual_price, and discount_price.
 */
function normalizeProduct(raw, index) {
  const rawCode = String(raw.code || raw.item_code || raw.sku || raw.product_code || raw.id || '').trim();
  const idDigits = raw.id ? String(raw.id).replace(/\D/g, '').slice(-3) : '';
  const item_code = rawCode || idDigits || String(index + 1).padStart(3, '0');

  const rawCandidate =
    raw.name ||
    raw.product_name ||
    raw.item_name ||
    raw.title ||
    raw.english_name ||
    raw.description ||
    `Cracker Item #${item_code}`;

  let name = sanitizeTextForPdf(rawCandidate);
  if (!name || name === 'undefined' || name === 'null') {
    const fallbackTitle = raw.english_name || raw.title || raw.product_name || '';
    name = sanitizeTextForPdf(fallbackTitle) || `Cracker Item #${item_code}`;
  }

  const rawCat = raw.category || raw.category_name || raw.group || 'Sparklers & Fountains';
  let category = sanitizeTextForPdf(rawCat);
  if (!category || category === 'undefined' || category === 'null') {
    category = 'Sparklers & Fountains';
  }

  const rawPack = raw.packing || raw.piece_count || raw.unit || raw.pack_size || '1 Box';
  let packing = sanitizeTextForPdf(rawPack);
  if (!packing || packing === 'undefined' || packing === 'null') {
    packing = '1 Box';
  }

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

  const results = [];
  let validIndex = 0;

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== 'object') continue;

    const hasAnyField = Object.entries(item).some(([_, val]) => {
      if (val === null || val === undefined) return false;
      return String(val).trim() !== '';
    });
    if (!hasAnyField) continue;

    const hasNameField = Boolean(
      item.name || item.product_name || item.item_name || item.title || item.english_name || item.description
    );
    const hasCategoryField = Boolean(
      item.category || item.category_name || item.group
    );

    if (!hasNameField && !hasCategoryField) {
      const code = item.code || item.item_code || item.id || (validIndex + 1);
      console.warn(`[Catalog PDF Warning] Item at index ${i} has no name and no category. Applying placeholder matching code: #${code}`);
    }

    results.push(normalizeProduct(item, validIndex));
    validIndex++;
  }

  return results;
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
