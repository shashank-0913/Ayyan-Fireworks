import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { INITIAL_PRODUCTS } from '../lib/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface RawProductInput {
  id?: string | number;
  item_code?: string;
  code?: string;
  sku?: string;
  product_code?: string;
  name?: string;
  item_name?: string;
  product_name?: string;
  title?: string;
  category?: string;
  category_name?: string;
  type?: string;
  group?: string;
  packing?: string;
  piece_count?: string;
  unit?: string;
  pack_size?: string;
  actual_price?: number | string;
  mrp?: number | string;
  regular_price?: number | string;
  original_price?: number | string;
  discount_price?: number | string;
  price?: number | string;
  sale_price?: number | string;
  rate?: number | string;
  [key: string]: any;
}

export interface NormalizedCatalogProduct {
  index: number;
  item_code: string;
  name: string;
  category: string;
  packing: string;
  actual_price: number;
  discount_price: number;
  actual_price_formatted: string;
  discount_price_formatted: string;
}

/**
 * Telugu firework keywords and compound terms mapped to standard English transliterations.
 */
const TELUGU_TO_ENGLISH_PAIRS: [string, string][] = [
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

/**
 * Unicode and Telugu Script Sanitizer for jsPDF:
 * - jsPDF standard fonts (Helvetica, Times, Courier) only support Latin-1 / WinAnsi encoding.
 * - Detects Telugu script (\u0C00-\u0C7F) and transliterates known vocabulary or strips unsupported characters
 * - Normalizes typographical quotes, dashes, ellipsis, and non-breaking spaces
 * - Prevents empty/whitespace cells from appearing in the generated PDF
 */
export function sanitizeTextForPdf(input: any, _codeHint?: string): string {
  if (input === null || input === undefined) return '';
  let str = String(input).trim();
  if (!str) return '';

  // 1. If Telugu script is present, replace known terms with English transliteration
  if (/[\u0C00-\u0C7F]/.test(str)) {
    for (const [tel, eng] of TELUGU_TO_ENGLISH_PAIRS) {
      if (str.includes(tel)) {
        str = str.split(tel).join(eng);
      }
    }
    // Strip any remaining untransliterated Telugu characters
    str = str.replace(/[\u0C00-\u0C7F]+/g, ' ');
  }

  // 2. Normalize typographical Unicode characters to standard ASCII equivalents
  str = str
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');

  // 3. Remove unsupported non-Latin-1 glyphs that cause jsPDF to drop characters
  str = str.replace(/[^\x20-\x7E\u00A0-\u00FF]/g, ' ');

  // 4. Compress multiple whitespaces
  str = str.replace(/\s+/g, ' ').trim();

  return str;
}

/**
 * Defensive data normalization for a single product record.
 * Guarantees fallbacks for name, item_code, category, packing, actual_price, and discount_price.
 */
export function normalizeProduct(raw: RawProductInput, index: number): NormalizedCatalogProduct {
  // 1. Item Code fallback
  const rawCode = String(raw.item_code || raw.code || raw.sku || raw.product_code || raw.id || '').trim();
  const idDigits = raw.id ? String(raw.id).replace(/\D/g, '').slice(-3) : '';
  const item_code = rawCode || idDigits || String(index + 1).padStart(3, '0');

  // 2. Product Name multi-key fallback:
  // name -> product_name -> item_name -> title -> english_name -> description -> Cracker Item #CODE
  const rawCandidate =
    raw.name ||
    raw.product_name ||
    raw.item_name ||
    raw.title ||
    raw.english_name ||
    `Cracker Item #${item_code}`;

  // Sanitize for jsPDF standard font compatibility (converts Telugu & strips unsupported Unicode)
  let name = sanitizeTextForPdf(rawCandidate, item_code);

  // If sanitization resulted in empty string, ensure robust fallback
  if (!name || name === 'undefined' || name === 'null') {
    const fallbackTitle = raw.english_name || raw.title || raw.product_name || '';
    name = sanitizeTextForPdf(fallbackTitle) || `Cracker Item #${item_code}`;
  }

  // 3. Category fallback
  const rawCat = raw.category || raw.category_name || raw.group || 'Sparklers';
  let category = sanitizeTextForPdf(rawCat);
  if (!category || category === 'undefined' || category === 'null') {
    category = 'Sparklers';
  }

  // 4. Packing fallback (pieces_per_box prioritized)
  const rawPack = raw.pieces_per_box || raw.packing || raw.piece_count || raw.unit || raw.pack_size || '1 Box';
  let packing = sanitizeTextForPdf(rawPack);
  if (!packing || packing === 'undefined' || packing === 'null') {
    packing = '1 Box';
  }

  // 5. Discount / Showroom Selling Price
  const parsedDiscount = parseFloat(String(raw.discount_price ?? raw.price ?? raw.sale_price ?? raw.rate ?? '0'));
  const discount_price = !isNaN(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : 50;

  // 6. Actual MRP Price (guaranteed to be >= discount_price)
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

/**
 * Filters out invalid null entries while preserving the full inventory count and normalizing all records.
 * If an item truly has no name and no category, logs a warning and ensures it shows a valid placeholder matching its code.
 */
export function filterAndNormalizeProducts(rawList: any[]): NormalizedCatalogProduct[] {
  if (!Array.isArray(rawList)) return [];

  const results: NormalizedCatalogProduct[] = [];
  let validIndex = 0;

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];

    // Filter out completely null, undefined, or non-object primitives
    if (!item || typeof item !== 'object') {
      continue;
    }

    // Filter out completely empty objects (e.g. {})
    const hasAnyField = Object.entries(item).some(([_, val]) => {
      if (val === null || val === undefined) return false;
      return String(val).trim() !== '';
    });
    if (!hasAnyField) {
      continue;
    }

    // Check if item truly has no name and no category
    const hasNameField = Boolean(
      item.name || item.product_name || item.item_name || item.title || item.english_name || item.description
    );
    const hasCategoryField = Boolean(
      item.category || item.category_name || item.group
    );

    if (!hasNameField && !hasCategoryField) {
      const code = item.code || item.item_code || item.id || (validIndex + 1);
      console.warn(`[Catalog PDF Warning] Item at index ${i} has no name and no category. Applying fallback placeholder matching code: #${code}`);
    }

    results.push(normalizeProduct(item, validIndex));
    validIndex++;
  }

  return results;
}

/**
 * Awaits all records from Supabase without pagination limits using a range loop.
 * Automatically handles databases with > 1000 items.
 */
export async function fetchAllProductsFromSupabase(client: any = supabase): Promise<any[]> {
  if (!isSupabaseConfigured || !client) {
    return [];
  }

  const PAGE_SIZE = 1000;
  let allRecords: any[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const to = from + PAGE_SIZE - 1;
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .range(from, to)
        .order('id', { ascending: true });

      if (error) {
        console.warn(`[Catalog PDF] Supabase range [${from}..${to}] error:`, error.message);
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
    } catch (err: any) {
      console.warn('[Catalog PDF] Supabase pagination fetch exception:', err?.message);
      break;
    }
  }

  return allRecords;
}

/**
 * Assembles and compiles the high-resolution Ayyan Fireworks Official 2026 Price List PDF.
 * Uses jspdf-autotable with exact column widths, multi-line wrapping for item names, and headers/footers.
 */
export function buildCatalogPdfDocument(products: NormalizedCatalogProduct[]): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4' // 210 x 297 mm
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 12;
  const marginRight = 12;

  // Total printable table width: 210 - 24 = 186mm
  // Column distribution:
  // Code: 16mm | Name: 68mm | Category: 36mm | Packing: 26mm | MRP: 20mm | Price: 20mm
  const tableRows = products.map((p) => [
    p.item_code,
    p.name,
    p.category,
    p.packing,
    p.actual_price_formatted,
    p.discount_price_formatted
  ]);

  autoTable(doc, {
    head: [['CODE', 'CRACKER NAME', 'CATEGORY', 'PACKING', 'MRP (₹)', 'PRICE (₹)']],
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
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [15, 23, 42], // obsidian slate-900
      textColor: [251, 191, 36], // amber-400 gold
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 2.8,
      lineWidth: 0.2,
      lineColor: [245, 158, 11]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
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
      doc.setFillColor(245, 158, 11); // amber-500
      doc.rect(0, 0, pageWidth, 4, 'F');

      // Top Title Bar
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12.5);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('AYYAN FIREWORKS (BUNNY BRAND) — SIVAKASI', marginLeft, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text('Official Wholesale & Showroom Price List 2026 • Visakhapatnam Flagship Store', marginLeft, 16);

      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text('100% Genuine Sivakasi Green Crackers • Certified Low-Emission Formulations • Supreme Court Compliant', marginLeft, 21);

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139); // slate-500
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

  // Second pass: Insert exact total page numbers on every page
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

/**
 * Loads inventory from Supabase (with pagination loop) or fallback initial data,
 * normalizes all fields, and returns the generated PDF document.
 */
export async function generateCompleteCatalogPdf(supabaseClient?: any): Promise<jsPDF> {
  let rawProducts: any[] = [];

  // 1. Fetch from Supabase with pagination loop if configured
  if (isSupabaseConfigured) {
    try {
      rawProducts = await fetchAllProductsFromSupabase(supabaseClient || supabase);
    } catch (e) {
      console.warn('[Catalog PDF] Could not fetch products from Supabase, using local catalog:', e);
    }
  }

  // 2. Fallback to full initial data if empty
  if (!rawProducts || rawProducts.length === 0) {
    rawProducts = INITIAL_PRODUCTS;
  } else if (rawProducts.length < INITIAL_PRODUCTS.length) {
    // Merge to preserve full inventory count without omissions
    const existingCodes = new Set(rawProducts.map(p => String(p.item_code || p.code || '').trim()));
    const missing = INITIAL_PRODUCTS.filter(p => !existingCodes.has(String(p.item_code || p.code || '').trim()));
    rawProducts = rawProducts.concat(missing);
  }

  // 3. Defensive Data Normalization (no blank cells or undefined values)
  const normalizedProducts = filterAndNormalizeProducts(rawProducts);

  // 4. Build and return jsPDF document
  return buildCatalogPdfDocument(normalizedProducts);
}
