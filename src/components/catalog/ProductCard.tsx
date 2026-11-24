import React, { useState } from 'react';
import {
  Check,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
} from 'lucide-react';
import type { Product } from '@domain/products/product.schema';
import {
  calculateUnitPrice,
  formatPricePEN,
} from '@domain/products/product.rules';
import {
  buildSingleProductMessage,
  buildWhatsappUrl,
} from '@domain/shared/whatsapp.service';
import { addToCart, openCartDrawer } from '@components/cart/cart.store';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  isFavorite,
  onToggleFavorite,
}) => {
  const [withMica, setWithMica] = useState(false);
  const [added, setAdded] = useState(false);

  const effectivePrice = calculateUnitPrice(product, withMica);
  const whatsappHref = buildWhatsappUrl(
    buildSingleProductMessage(product, withMica)
  );

  function handleAdd() {
    addToCart(product, withMica);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    openCartDrawer();
  }

  const fullStars = Math.round(product.rating);

  if (viewMode === 'list') {
    return (
      <article className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-5 rounded-xl bg-white p-4 border border-zinc-200/80 hover:border-zinc-300 transition-all">
        <div className="relative h-36 w-full sm:w-40 shrink-0 rounded-lg bg-[#f5f5f7] flex items-center justify-center p-3">
          {product.badge && (
            <span className="absolute left-2.5 top-2.5 rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {product.badge}
            </span>
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">
                {product.brand} · {product.subtype}
              </p>
              <h3 className="mt-0.5 text-sm font-bold text-zinc-900">
                {product.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onToggleFavorite(product.id)}
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-zinc-400 hover:text-orange-500 hover:bg-zinc-50'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-3.5 w-3.5 ${
                    idx < fullStars ? 'fill-current' : 'text-zinc-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-400">
              ({product.reviewCount} reseñas)
            </span>
          </div>

          {product.supportsMicaAddon && (
            <label className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-[#f5f5f7] border border-zinc-200/80 px-2.5 py-1.5 text-xs text-zinc-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={withMica}
                onChange={(e) => setWithMica(e.target.checked)}
                className="accent-orange-500 h-3.5 w-3.5 rounded"
              />
              <span>
                Agregar mica de vidrio{' '}
                <strong className="text-zinc-900">+ S/ {product.micaAddonPrice}</strong>
              </span>
            </label>
          )}
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-3 sm:pt-0 sm:pl-5">
          <div className="text-left sm:text-right">
            <p className="text-lg font-extrabold text-zinc-900">
              {formatPricePEN(effectivePrice)}
            </p>
            {product.compareAtPrice && effectivePrice !== null && (
              <p className="text-xs text-zinc-400 line-through">
                {formatPricePEN(
                  product.compareAtPrice + (withMica ? product.micaAddonPrice : 0)
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-orange-500 transition-colors cursor-pointer"
            >
              {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
              {added ? 'Agregado' : 'Agregar'}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              title="Pedir directamente por WhatsApp"
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              aria-label={`Pedir ${product.name} por WhatsApp`}
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col justify-between rounded-xl bg-white p-3.5 border border-zinc-200/80 hover:border-zinc-300 transition-all">
      <div>
        {/* Superficie Bento #f5f5f7 con badge y favorito */}
        <div className="relative rounded-lg bg-[#f5f5f7] p-3 flex flex-col items-center justify-center h-48 overflow-hidden">
          <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
            {product.badge ? (
              <span className="inline-flex items-center rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                {product.badge}
              </span>
            ) : (
              <span className="inline-flex items-center rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                {product.subtype}
              </span>
            )}

            <button
              type="button"
              onClick={() => onToggleFavorite(product.id)}
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-xs transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-orange-500'
                  : 'text-zinc-400 hover:text-orange-500'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="max-h-36 w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Título y reseñas */}
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {product.brand}
          </p>
          <h3 className="mt-0.5 text-[13px] font-bold text-zinc-900 leading-snug line-clamp-2 min-h-[36px]">
            {product.name}
          </h3>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-3 w-3 ${
                  idx < fullStars ? 'fill-current' : 'text-zinc-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-zinc-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* Extra de mica para fundas */}
        {product.supportsMicaAddon && (
          <label className="mt-2.5 flex items-center gap-2 rounded-lg bg-[#f5f5f7] border border-zinc-200/70 px-2.5 py-1.5 text-[11px] text-zinc-700 cursor-pointer select-none hover:border-orange-300 transition-colors">
            <input
              type="checkbox"
              checked={withMica}
              onChange={(e) => setWithMica(e.target.checked)}
              className="accent-orange-500 h-3.5 w-3.5 rounded shrink-0"
            />
            <span className="truncate">
              Mica vidrio <strong>+ S/ {product.micaAddonPrice}</strong>
            </span>
          </label>
        )}
      </div>

      {/* Precio + botones de acción */}
      <div className="mt-3.5 pt-3 border-t border-zinc-100">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-zinc-900">
            {formatPricePEN(effectivePrice)}
          </span>
          {product.compareAtPrice && effectivePrice !== null && (
            <span className="text-xs text-zinc-400 line-through">
              {formatPricePEN(
                product.compareAtPrice + (withMica ? product.micaAddonPrice : 0)
              )}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500 transition-colors cursor-pointer"
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Agregado
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                Agregar
              </>
            )}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Pedir por WhatsApp"
            className="inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
            aria-label={`Pedir ${product.name} por WhatsApp`}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};
