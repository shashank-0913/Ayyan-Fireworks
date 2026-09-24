import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon,
  Sparkles,
  Loader2,
  XCircle,
  Tag
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Product, ProductCategory, PRODUCT_CATEGORIES } from '../../types';
import { formatINR } from '../../lib/utils';
import { ProductDrawer } from '../../components/portal/ProductDrawer';
import { uploadProductImage } from '../../lib/supabase';

const PRESET_IMAGES = [
  { label: 'Sparklers', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80' },
  { label: 'Emerald Sparklers', url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ground Chakkars', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flower Pots', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80' },
  { label: 'Conical Fountains', url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sky Rockets', url: 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aerial Multi-Shots', url: 'https://images.unsplash.com/photo-1521478706270-f6e9b2d59e3a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gift Boxes', url: 'https://images.unsplash.com/photo-1533230807127-716665511457?auto=format&fit=crop&w=800&q=80' },
];

export const PortalProductsPage: React.FC = () => {
  const { products, addProduct, toggleProductActive, deleteProduct } = useAyyanStore();

  // Search & Filter state for table
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  
  // Drawer editing state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick Inline Add Form State
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sparklers');
  const [price, setPrice] = useState<number | string>('250');
  const [pieceCount, setPieceCount] = useState('Box of 10 Pieces');
  const [description, setDescription] = useState('');
  const [safetyInstructions, setSafetyInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const publicUrl = await uploadProductImage(file);
      setImageUrl(publicUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePublishNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsPublishing(true);
    try {
      await addProduct({
        name: name.trim(),
        category,
        price: Number(price) || 0,
        piece_count: pieceCount.trim() || '1 Box',
        description: description.trim() || 'Premium Sivakasi festive pyrotechnic creation.',
        safety_instructions: safetyInstructions.trim() || 'Maintain safe clearance. Place on hard flat ground.',
        image_url: imageUrl,
        is_active: true
      });

      // Clear Form
      setName('');
      setCategory('Sparklers');
      setPrice('250');
      setPieceCount('Box of 10 Pieces');
      setDescription('');
      setSafetyInstructions('');
      setImageUrl(PRESET_IMAGES[0].url);

      // Trigger Toast
      setToastMessage('Product successfully published to live catalogue!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to add product:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancelForm = () => {
    setName('');
    setCategory('Sparklers');
    setPrice('250');
    setPieceCount('Box of 10 Pieces');
    setDescription('');
    setSafetyInstructions('');
    setImageUrl(PRESET_IMAGES[0].url);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-400" />
              Owner Product Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
              Authenticated Staff Only
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Add new items directly to Supabase with real-time updates and full catalogue management.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormExpanded(prev => !prev)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormExpanded ? 'Collapse Add Form' : '+ Add New Product SKU'}</span>
        </button>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. OWNER'S "+ ADD PRODUCT" INTERFACE FORM                                 */}
      {/* ========================================================================= */}
      {isFormExpanded && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top glow accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-gold-400 to-amber-500" />

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  + Add New Product to Catalogue
                </h2>
                <p className="text-[11px] text-slate-400">
                  Fill in the details below to publish live to the customer showroom catalogue.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              Clean Slate Input
            </span>
          </div>

          <form onSubmit={handlePublishNewProduct} className="space-y-6 text-xs">
            {/* ----------------------------------------------------------------- */}
            {/* 1. TOP SECTION — MEDIA & IDENTITY                                 */}
            {/* ----------------------------------------------------------------- */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <ImageIcon className="w-4 h-4" />
                <span>1. Top Section: Media & Identity</span>
              </div>

              {/* Product Image Uploader */}
              <div className="space-y-3">
                <label className="font-bold text-slate-300 block">
                  Product Image Uploader (Supabase Storage Bucket: <code className="text-amber-400 text-[10px]">product-images</code>)
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Image Preview */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shrink-0 flex items-center justify-center shadow-md">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-amber-400 gap-1 text-[10px]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions & URL */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 cursor-pointer font-bold text-xs transition-colors shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>{isUploadingImage ? 'Uploading...' : 'Choose File to Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">JPG, PNG or WebP</span>
                    </div>

                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Preset Pyrotechnic Images */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
                    Quick Sample Presets:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap border transition-all ${
                          imageUrl === preset.url
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-300 block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Standard 10cm Electric Sparklers"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Category & Piece Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">
                    Pack / Piece Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={pieceCount}
                    onChange={(e) => setPieceCount(e.target.value)}
                    placeholder="e.g. Box of 10 Pieces"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* 2. MIDDLE SECTION — PRICING                                       */}
            {/* ----------------------------------------------------------------- */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Tag className="w-4 h-4" />
                <span>2. Middle Section: Pricing</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  Price in ₹ INR (Bold Numeric Input) *
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-2.5 text-xl font-bold text-amber-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="250"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xl font-mono font-black text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Showroom factory direct price in Indian Rupees (e.g. 250).
                </p>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* 3. BOTTOM SECTION — DESCRIPTION & DETAILS                         */}
            {/* ----------------------------------------------------------------- */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Package className="w-4 h-4" />
                <span>3. Bottom Section: Description & Details</span>
              </div>

              {/* Full Description & Visual Effects */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  Full Description & Visual Effects (Multi-line)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe colors, sparks, burn duration, visual spectacle, and atmosphere..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Safety Instructions */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  Safety Instructions (Multi-line)
                </label>
                <textarea
                  rows={2}
                  value={safetyInstructions}
                  onChange={(e) => setSafetyInstructions(e.target.value)}
                  placeholder="Lighting guidelines, recommended safe distance (e.g. 5m / 10m), ground placement precautions..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Action Buttons: Publish & Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPublishing || isUploadingImage || !name.trim()}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-glow-gold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish to Catalogue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANAGEMENT TABLE OF OWNER-ADDED PRODUCTS                                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Table Filter / Search Header */}
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
            {(['All', ...PRODUCT_CATEGORIES] as const).map((cat) => (
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
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price (₹)</th>
                  <th className="px-4 py-4">Pack Breakdown</th>
                  <th className="px-4 py-4">Catalogue Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length > 0 ? (
                  filtered.map((product) => (
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
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
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
                      <td className="px-4 py-4 text-slate-300 font-medium">
                        {product.piece_count}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => toggleProductActive(product.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border transition-colors ${
                            product.is_active
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
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
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors"
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
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <div className="max-w-md mx-auto space-y-2">
                        <Package className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-sm">
                          {products.length === 0 ? 'Zero Products in Database (Clean Slate)' : 'No matching products'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {products.length === 0 
                            ? 'Use the "+ Add New Product" form above to publish your first certified fireworks SKU to the live 2026 catalogue.'
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

      {/* Product Drawer for Editing */}
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
