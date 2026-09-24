import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Product, ProductCategory, SoundLevel } from '../../types';
import { useAyyanStore } from '../../context/AppContext';

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Sparklers',
  'Ground Spinners',
  'Flower Pots & Fountains',
  'Sky Rockets & Missiles',
  'Aerial Multi-Shot Cakes',
  'Curated Family Gift Boxes'
];

const SOUND_LEVELS: SoundLevel[] = ['Low / Silent', 'Medium', 'High Spectacle'];

const PRESET_IMAGES = [
  { label: 'Sparklers', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80' },
  { label: 'Emerald Sparks', url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chakkars', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flower Pots', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fountains', url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rockets', url: 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Missiles', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aerial Cake 12s', url: 'https://images.unsplash.com/photo-1521478706270-f6e9b2d59e3a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aerial 30s', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gala 120s', url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gift Hamper', url: 'https://images.unsplash.com/photo-1533230807127-716665511457?auto=format&fit=crop&w=800&q=80' },
  { label: 'VIP Chest', url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80' },
];

export const ProductDrawer: React.FC<ProductDrawerProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, deleteProduct } = useAyyanStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sparklers');
  const [price, setPrice] = useState<number>(250);
  const [pieceCount, setPieceCount] = useState('10 Pieces / Box');
  const [description, setDescription] = useState('');
  const [safetyInstructions, setSafetyInstructions] = useState('');
  const [safetyTagsStr, setSafetyTagsStr] = useState('Low Smoke, Family Safe, PESO Certified');
  const [soundLevel, setSoundLevel] = useState<SoundLevel>('Medium');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setPieceCount(productToEdit.piece_count);
      setDescription(productToEdit.description);
      setSafetyInstructions(productToEdit.safety_instructions);
      setSafetyTagsStr(productToEdit.safety_tags?.join(', ') || '');
      setSoundLevel(productToEdit.sound_level || 'Medium');
      setImageUrl(productToEdit.image_url);
      setIsActive(productToEdit.is_active);
    } else {
      setName('');
      setCategory('Sparklers');
      setPrice(250);
      setPieceCount('10 Pieces / Box');
      setDescription('Certified premium Sivakasi fireworks with vibrant colors and reliable fuse timing.');
      setSafetyInstructions('Keep clear perimeter of 5 meters. Place on flat hard surface and ignite with agarbatti.');
      setSafetyTagsStr('Low Smoke, Vibrant Colors, Green Pyrotechnics');
      setSoundLevel('Low / Silent');
      setImageUrl(PRESET_IMAGES[0].url);
      setIsActive(true);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const tags = safetyTagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          name: name.trim(),
          category,
          price: Number(price),
          piece_count: pieceCount.trim(),
          description: description.trim(),
          safety_instructions: safetyInstructions.trim(),
          safety_tags: tags,
          sound_level: soundLevel,
          image_url: imageUrl,
          is_active: isActive
        });
      } else {
        await addProduct({
          name: name.trim(),
          category,
          price: Number(price),
          piece_count: pieceCount.trim(),
          description: description.trim(),
          safety_instructions: safetyInstructions.trim(),
          safety_tags: tags,
          sound_level: soundLevel,
          image_url: imageUrl,
          is_active: isActive
        });
      }
      onClose();
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-white">
              {productToEdit ? 'Edit Catalogue Item' : 'Add New Fireworks Product'}
            </h3>
            <p className="text-xs text-slate-400">
              Manage product pricing, safety specifications, and showroom inventory.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Name & Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Golden Palm 30-Shot Cake"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Direct Factory Price (₹) *</label>
              <input
                type="number"
                min="0"
                step="5"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Pack Breakdown / Pieces *</label>
              <input
                type="text"
                required
                value={pieceCount}
                onChange={(e) => setPieceCount(e.target.value)}
                placeholder="e.g. 10 Pcs / Box or 1 Cake"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Sound & Smoke Classification</label>
              <select
                value={soundLevel}
                onChange={(e) => setSoundLevel(e.target.value as SoundLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {SOUND_LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Selection & Upload */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="font-bold text-amber-400 uppercase tracking-wider block">
              Product Image Preview & Presets
            </label>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500"
                />

                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Local Image</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Quick Presets Carousel */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">
                Quick Sivakasi High-Res Pyrotechnic Presets:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap border transition-all ${
                      imageUrl === preset.url
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Catalogue Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of effect, colors and fireworks performance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Safety Instructions & Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Safety Guidelines & Firing Distance
            </label>
            <textarea
              rows={2}
              value={safetyInstructions}
              onChange={(e) => setSafetyInstructions(e.target.value)}
              placeholder="Recommended clearance distance and lighting instructions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Safety Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={safetyTagsStr}
              onChange={(e) => setSafetyTagsStr(e.target.value)}
              placeholder="e.g. Low Smoke, Child Friendly, Green Chemistry"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Active in Public Catalogue</span>
              <span className="text-[11px] text-slate-400">If toggled off, hidden from consumer portal.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </form>

        {/* Drawer Actions Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between gap-3">
          {productToEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
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
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : productToEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
