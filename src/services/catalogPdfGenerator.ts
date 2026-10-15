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
 * Defensive data normalization for a single product record.
 * Guarantees fallbacks for name, item_code, category, packing, actual_price, and discount_price.
 */
export function normalizeProduct(raw: RawProductInput, index: number): NormalizedCatalogProduct {
  // 1. Name fallback
  const rawName = String(raw.name || raw.item_name || raw.product_name || raw.title || '').trim();
  const name = rawName || `Ayyan Special Cracker #${index + 1}`;

  // 2. Item Code fallback
  const rawCode = String(raw.item_code || raw.code || raw.sku || raw.product_code || '').trim();
  const idDigits = raw.id ? String(raw.id).replace(/\D/g, '').slice(-3) : '';
  const item_code = rawCode || idDigits || String(index + 1).padStart(3, '0');

  // 3. Category fallback
  const rawCat = String(raw.category || raw.category_name || raw.group || raw.type || '').trim();
  const category = rawCat || 'Sivakasi Sparklers & Crackers';

  // 4. Packing fallback
  const rawPack = String(raw.packing || raw.piece_count || raw.unit || raw.pack_size || '').trim();
  const packing = rawPack || '1 Box';

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
 */
export function filterAndNormalizeProducts(rawList: any[]): NormalizedCatalogProduct[] {
  if (!Array.isArray(rawList)) return [];

  const validEntries = rawList.filter(item => {
    if (!item || typeof item !== 'object') return false;
    // Keep entries that have at least one usable identifier or price
    const hasValue = Boolean(
      item.name || item.item_name || item.product_name || item.title ||
      item.code || item.item_code || item.sku || item.id ||
      item.price !== undefined || item.actual_price !== undefined || item.rate !== undefined
    );
    return hasValue;
  });

  return validEntries.map((item, idx) => normalizeProduct(item, idx));
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
    const existingCodes = new Set(rawProducts.map(p => String(p.code || p.item_code || '').trim()));
    const missing = INITIAL_PRODUCTS.filter(p => !existingCodes.has(String(p.code).trim()));
    rawProducts = rawProducts.concat(missing);
  }

  // 3. Defensive Data Normalization (no blank cells or undefined values)
  const normalizedProducts = filterAndNormalizeProducts(rawProducts);

  // 4. Build and return jsPDF document
  return buildCatalogPdfDocument(normalizedProducts);
}
