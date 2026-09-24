import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Volume2
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { formatINR } from '../../lib/utils';
import { ProductDrawer } from '../../components/portal/ProductDrawer';

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Sparklers',
  'Ground Spinners',
  'Flower Pots & Fountains',
  'Sky Rockets & Missiles',
  'Aerial Multi-Shot Cakes',
  'Curated Family Gift Boxes'
];

export const PortalProductsPage: React.FC = () => {
  const { products, toggleProductActive, deleteProduct } = useAyyanStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
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

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (p: Product) => {
    if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
      await deleteProduct(p.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            Catalogue & Inventory Manager
          </h1>
          <p className="text-xs text-slate-400">
            Full control over prices in ₹ INR, pack breakdowns, safety tags, and public catalogue visibility.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product SKU</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name or category..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CRUD Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Direct Price (₹)</th>
                <th className="px-4 py-4">Pack Breakdown</th>
                <th className="px-4 py-4">Sound / Smoke</th>
                <th className="px-4 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Item Image & Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-white text-sm block">{product.name}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          {product.safety_tags?.slice(0, 2).map((t, i) => (
                            <span key={i} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold text-[11px]">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 font-mono font-bold text-white text-sm">
                    {formatINR(product.price)}
                  </td>

                  {/* Pack Count */}
                  <td className="px-4 py-4 text-slate-300">
                    {product.piece_count}
                  </td>

                  {/* Sound */}
                  <td className="px-4 py-4 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      {product.sound_level}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleProductActive(product.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                        product.is_active
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title="Click to toggle public visibility"
                    >
                      {product.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{product.is_active ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Drawer */}
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
