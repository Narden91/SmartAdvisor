import React from 'react';
import { FinancialProduct } from '../../types';
import { PrestitoIcon, FinanziariaIcon, MutuoIcon } from '../icons';

interface ProductSelectorProps {
  product: FinancialProduct;
  onProductChange: (product: FinancialProduct) => void;
}

const products: { id: FinancialProduct; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'Prestito', label: 'Prestito', icon: PrestitoIcon },
  { id: 'Finanziaria', label: 'Finanziaria', icon: FinanziariaIcon },
  { id: 'Mutuo', label: 'Mutuo', icon: MutuoIcon },
];

const ProductSelector: React.FC<ProductSelectorProps> = React.memo(({ product, onProductChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-2">Tipo di Finanziamento</h2>
      <p className="text-slate-400 mb-4">Scegli il prodotto che ti interessa.</p>
      <div className="grid grid-cols-3 gap-3">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onProductChange(p.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 transform-gpu ${
              product === p.id
                ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/20 shadow-lg scale-105'
                : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            <p.icon className="w-8 h-8 mb-1.5" />
            <span className="text-sm font-semibold">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

ProductSelector.displayName = 'ProductSelector';

export default ProductSelector;
