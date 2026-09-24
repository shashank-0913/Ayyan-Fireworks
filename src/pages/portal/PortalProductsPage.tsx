import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Product, ProductCategory, PRODUCT_CATEGORIES } from '../../types';
import { formatINR } from '../../lib/utils';
import { ProductDrawer } from '../../components/portal/ProductDrawer';

export const PortalProductsPage: React.FC = () => {
  const { products, toggleProductActive, deleteProduct } = useAyyanStore();

  // Search & Filter state for table
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  
  // Drawer editing state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [products, search, selectedCategory]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleAddNewFromDrawer = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (p: Product) => {
    if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
      await deleteProduct(p.id);
      setToastMessage(`Deleted ${p.name}`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-20 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Owner Product Inventory</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[9px] sm:text-[10px] uppercase">
              Staff Only
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add and manage fireworks inventory directly with Supabase storage and instant price sync.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewFromDrawer}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-gold-400 hover:from-amber-400 hover:to-gold-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-glow-gold active:scale-95 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-slate-900 dark:hover:text-white p-1">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MANAGEMENT OF OWNER-ADDED PRODUCTS (MOBILE CARDS + DESKTOP TABLE)      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Table Filter / Search Header */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-between shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items by name..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[40px]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {(['All', ...PRODUCT_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* MOBILE VIEW (< 768px): Vertical Product Management Cards          */}
        {/* ----------------------------------------------------------------- */}
        <div className="block md:hidden space-y-3">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <div 
                key={product.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        {product.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleProductActive(product.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors min-h-[28px] ${
                          product.is_active
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {product.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{product.is_active ? 'Active' : 'Hidden'}</span>
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{product.name}</h4>
                    
                    <div className="flex items-baseline justify-between pt-0.5">
                      <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                        {formatINR(product.price)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {product.piece_count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Min 44x44px touch targets) */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[40px] border border-slate-300 dark:border-slate-700"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Edit SKU</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="py-2 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[40px] border border-red-200 dark:border-red-500/30"
                    title="Delete SKU"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <Package className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {products.length === 0 ? 'Zero Products (Clean Slate)' : 'No Matching Products'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {products.length === 0 ? 'Tap "+ Add New Product" below to publish your first firework SKU.' : 'Try adjusting your search or category filter.'}
              </p>
              <button
                type="button"
                onClick={handleAddNewFromDrawer}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs min-h-[44px]"
              >
                + Add Product Now
              </button>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* DESKTOP VIEW (>= 768px): Wide Data Table                          */}
        {/* ----------------------------------------------------------------- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price (₹)</th>
                  <th className="px-4 py-4">Pack Breakdown</th>
                  <th className="px-4 py-4">Catalogue Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filtered.length > 0 ? (
                  filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Item Image & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 dark:text-white text-sm block">{product.name}</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-semibold text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {formatINR(product.price)}
                      </td>

                      {/* Pack Count */}
                      <td className="px-4 py-4 text-slate-700 dark:text-slate-300 font-medium">
                        {product.piece_count}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => toggleProductActive(product.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border transition-colors ${
                            product.is_active
                              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                          }`}
                          title="Click to toggle public visibility"
                        >
                          {product.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{product.is_active ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions: One-click Edit & Delete */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 transition-colors border border-slate-200 dark:border-transparent"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-slate-800 dark:hover:bg-red-950 text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors border border-red-200 dark:border-transparent"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="max-w-md mx-auto space-y-2">
                        <Package className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {products.length === 0 ? 'Zero Products in Database (Clean Slate)' : 'No matching products'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {products.length === 0 
                            ? 'Use the "+ Add New Product" button above to publish your first certified fireworks SKU to the live 2026 catalogue.'
                            : 'Try adjusting your search or category filter.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Sticky Bottom Bar for Mobile to quickly "+ Add Product" */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl z-30 pb-safe">
        <button
          type="button"
          onClick={handleAddNewFromDrawer}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-gold-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-gold active:scale-98 min-h-[48px]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product SKU</span>
        </button>
      </div>

      {/* Product Drawer (Full screen modal on mobile, slide drawer on desktop) */}
      <ProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />
    </div>
  );
};
