import React from 'react';
import { ProductSafetyModal } from './ProductSafetyModal';
import { Product } from '../../types';

export interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  return <ProductSafetyModal product={product} onClose={onClose} />;
};

export default ProductDetailModal;
