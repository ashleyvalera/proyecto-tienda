import React, { useState } from 'react';
import { Check, Heart, Plus } from 'lucide-react';
import type { Product } from '@domain/products/product.schema';
import { formatPricePEN } from '@domain/products/product.rules';
import { addToCart, openCartDrawer } from '@components/cart/cart.store';
import { useFavorites } from '@components/shared/favorites.store';

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const [selectedSwatches, setSelectedSwatches] = useState<Record<string, number>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  function handleQuickAdd(product: Product) {
    addToCart(product, false);
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1200);
    openCartDrawer();
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 sm:px-8 py-6">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="inline-block border-b-2 border-orange-500 pb-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">
          Ofertas de temporada
        </h2>
        <a
          href="/catalogo"
          className="text-xs font-semibold text-zinc-500 hover:text-orange-500 transition-colors"
        >
          Ver todo &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => {
          const activeSwatch = selectedSwatches[product.id] ?? 0;
          const isAdded = justAdded === product.id;
          const isFav = favorites.includes(product.id);

          return (
            <article key={product.id} className="group flex flex-col">
              <div className="relative rounded-xl bg-[#f5f5f7] px-4 pt-5 pb-4 flex flex-col items-center justify-between aspect-[4/5] overflow-hidden border border-transparent hover:border-zinc-200 transition-all">
                <a
                  href={`/catalogo?categoria=${product.category}&q=${encodeURIComponent(product.name)}`}
                  className="flex flex-1 w-full items-center justify-center"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="max-h-40 w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </a>

                {/* Acciones rápidas: Favorito + Agregar */}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm transition-all cursor-pointer ${
                      isFav
                        ? 'text-orange-500 opacity-100'
                        : 'text-zinc-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-orange-500'
                    }`}
                    aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    title="Agregar al carrito"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    {isAdded ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Puntos de color / variantes */}
                <div className="mt-3 flex items-center justify-center gap-1.5 min-h-[14px]">
                  {product.swatches.slice(0, 5).map((hex, index) => (
                    <button
                      key={`${product.id}-swatch-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedSwatches((prev) => ({
                          ...prev,
                          [product.id]: index,
                        }))
                      }
                      aria-label={`Variante ${index + 1}`}
                      className={`h-2.5 w-2.5 rounded-full border transition-transform cursor-pointer ${
                        activeSwatch === index
                          ? 'scale-125 border-zinc-800 ring-1 ring-zinc-300'
                          : 'border-zinc-300/80'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2.5 space-y-0.5">
                <a
                  href={`/catalogo?categoria=${product.category}&q=${encodeURIComponent(product.name)}`}
                  className="block text-[12px] font-medium text-zinc-900 leading-snug line-clamp-2 hover:text-orange-600 transition-colors"
                >
                  {product.name}
                </a>
                <p className="text-[12px] font-semibold text-zinc-600">
                  {product.price !== null
                    ? `Desde ${formatPricePEN(product.price)}`
                    : 'Consultar precio'}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
