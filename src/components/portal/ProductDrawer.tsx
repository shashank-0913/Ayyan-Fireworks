import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, Image as ImageIcon, Loader2, Camera, Tag, Package } from 'lucide-react';
import { Product, ProductCategory, PRODUCT_CATEGORIES } from '../../types';
import { useAyyanStore } from '../../context/AppContext';
import { uploadProductImage } from '../../lib/supabase';

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

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

export const ProductDrawer: React.FC<ProductDrawerProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, deleteProduct } = useAyyanStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sparklers');
  const [price, setPrice] = useState<number | string>(250);
  const [pieceCount, setPieceCount] = useState('Box of 10 Pieces');
  const [description, setDescription] = useState('');
  const [safetyInstructions, setSafetyInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isActive, setIsActive] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setPieceCount(productToEdit.piece_count);
      setDescription(productToEdit.description);
      setSafetyInstructions(productToEdit.safety_instructions);
      setImageUrl(productToEdit.image_url);
      setIsActive(productToEdit.is_active);
    } else {
      setName('');
      setCategory('Sparklers');
      setPrice(250);
      setPieceCount('Box of 10 Pieces');
      setDescription('');
      setSafetyInstructions('');
      setImageUrl(PRESET_IMAGES[0].url);
      setIsActive(true);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          name: name.trim(),
          category,
          price: Number(price) || 0,
          piece_count: pieceCount.trim() || '1 Box',
          description: description.trim() || 'Authentic Sivakasi fireworks creation.',
          safety_instructions: safetyInstructions.trim() || 'Keep safe clearance. Place on hard flat ground.',
          image_url: imageUrl,
          is_active: isActive
        });
        setToastMessage('Product updated successfully!');
      } else {
        await addProduct({
          name: name.trim(),
          category,
          price: Number(price) || 0,
          piece_count: pieceCount.trim() || '1 Box',
          description: description.trim() || 'Authentic Sivakasi fireworks creation.',
          safety_instructions: safetyInstructions.trim() || 'Keep safe clearance. Place on hard flat ground.',
          image_url: imageUrl,
          is_active: isActive
        });
        setToastMessage('Product published to catalogue!');
      }

      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productToEdit) return;
    if (window.confirm(`Are you sure you want to permanently delete "${productToEdit.name}"?`)) {
      await deleteProduct(productToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 dark:bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/90 sticky top-0 z-20">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {productToEdit ? 'Edit Product Details' : 'Owner: + Add New Product'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Directly sync to Supabase storage and 2026 catalogue.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200 dark:border-transparent"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Drawer Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* ========================================================================= */}
          {/* SECTION 1: MEDIA & IDENTITY                                               */}
          {/* ========================================================================= */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>1. Product Image & Identity</span>
            </h4>

            {/* Product Image Uploader with Native Camera / Gallery Trigger */}
            <div className="space-y-2.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Product Photo (Camera / Gallery Upload)</label>
              <div className="flex items-center gap-3.5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center shadow-sm">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-amber-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 cursor-pointer text-xs font-bold transition-colors min-h-[40px]">
                      <Camera className="w-4 h-4" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Take Photo / Upload'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        disabled={isUploadingImage} 
                      />
                    </label>
                  </div>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 font-mono focus:outline-none focus:border-amber-500 min-h-[38px]"
                  />
                </div>
              </div>

              {/* Quick Preset Images */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Or select sample Sivakasi visual:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap border transition-all min-h-[30px] ${
                        imageUrl === preset.url
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/50 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-1.5 pt-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard 10cm Electric Sparklers"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
              />
            </div>

            {/* Category & Pack Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-medium min-h-[44px]"
                >
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Pack / Piece Quantity *</label>
                <input
                  type="text"
                  required
                  value={pieceCount}
                  onChange={(e) => setPieceCount(e.target.value)}
                  placeholder="e.g. Box of 10 Pieces"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: PRICING (Numeric Keypad inputMode="numeric")                    */}
          {/* ========================================================================= */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>2. Factory Direct Pricing</span>
            </h4>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Price in ₹ INR *</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-lg font-bold text-amber-600 dark:text-amber-400">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="250"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-500 min-h-[48px]"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: DESCRIPTION & DETAILS                                          */}
          {/* ========================================================================= */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span>3. Description & Details</span>
            </h4>

            {/* Description & Effects */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Full Description & Visual Effects</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe pyrotechnic performance, colors, sparkles, burn duration..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Safety Instructions */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Safety Instructions & Guidelines</label>
              <textarea
                rows={2}
                value={safetyInstructions}
                onChange={(e) => setSafetyInstructions(e.target.value)}
                placeholder="Lighting guidelines, safe clearance radius (e.g. 5m / 10m), ground placement..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Catalogue Visibility</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Make live to public visitors</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors min-h-[28px] ${
                  isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
        </form>

        {/* Drawer Actions Sticky Footer with pb-safe */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex items-center justify-between gap-3 sticky bottom-0 z-20 pb-safe">
          {productToEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold min-h-[44px] transition-colors"
            >
              Cancel
            </button>
            <button
              form="product-form"
              type="submit"
              disabled={isSaving || isUploadingImage}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs transition-colors shadow-md disabled:opacity-50 min-h-[44px]"
            >
              {isSaving ? 'Publishing...' : productToEdit ? 'Update Product' : 'Publish to Catalogue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
