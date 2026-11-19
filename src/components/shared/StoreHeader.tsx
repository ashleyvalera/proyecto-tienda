import React, { useEffect, useState } from 'react';
import {
  Heart,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { BrandLogo } from '@components/brand/BrandLogo';
import {
  calculateCartSummary,
  openCartDrawer,
  readCart,
  subscribeCart,
} from '@components/cart/cart.store';
import { useFavorites } from '@components/shared/favorites.store';
import { formatPricePEN } from '@domain/products/product.rules';
import { STORE_INFO } from '@domain/shared/store.constants';
import { buildWhatsappUrl } from '@domain/shared/whatsapp.service';

interface StoreHeaderProps {
  currentPath: '/' | '/catalogo';
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onOpenFavorites?: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  currentPath,
  searchValue,
  onSearchChange,
  onOpenFavorites,
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue ?? '');
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    totalItems: 0,
    hasQuoteItems: false,
  });
  const { favorites } = useFavorites();

  useEffect(() => {
    if (searchValue !== undefined) {
      setLocalSearch(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    setCartSummary(calculateCartSummary(readCart()));
    return subscribeCart((items) => setCartSummary(calculateCartSummary(items)));
  }, []);

  function handleSearchSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const term = localSearch.trim();
    if (onSearchChange) {
      onSearchChange(term);
      return;
    }
    window.location.href = term
      ? `/catalogo?q=${encodeURIComponent(term)}`
      : '/catalogo';
  }

  function handleFavoritesClick() {
    if (onOpenFavorites) {
      onOpenFavorites();
      return;
    }
    window.location.href = '/catalogo?favoritos=1';
  }

  const navItems = [
    { label: 'Inicio', href: '/', active: currentPath === '/' },
    { label: 'Catálogo', href: '/catalogo', active: currentPath === '/catalogo' },
    { label: 'Nosotros', href: '/#nosotros', active: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-zinc-200/80">
      {/* Top utility bar (estilo catálogo) */}
      <div className="border-b border-zinc-100 bg-[#f5f5f7]/70">
        <div className="mx-auto flex h-8.5 max-w-[1280px] items-center justify-between px-4 sm:px-8 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5 font-medium text-zinc-700">
            <MapPin className="h-3.5 w-3.5 text-orange-500" />
            <span>{STORE_INFO.address}</span>
            <span className="hidden sm:inline text-zinc-300 mx-1">·</span>
            <span className="hidden sm:inline text-zinc-500">
              {STORE_INFO.schedule.weekdays}
            </span>
          </div>

          <a
            href={buildWhatsappUrl(STORE_INFO.defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 hover:text-orange-500 transition-colors"
          >
            <Phone className="h-3 w-3 text-orange-500" />
            <span>{STORE_INFO.whatsappDisplay}</span>
          </a>
        </div>
      </div>

      {/* Main Swiss Navbar: Logo + 3 links + Buscador + Favoritos + Carrito */}
      <div className="mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sm:gap-5 max-w-[1280px] px-4 sm:px-8 py-3">
        <div className="flex items-center gap-6 lg:gap-8">
          <BrandLogo />

          <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative py-1 text-[13px] font-semibold transition-colors ${
                  item.active
                    ? 'text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                {item.label}
                {item.active && (
                  <span
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-orange-500 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Buscador unificado */}
        <form
          onSubmit={handleSearchSubmit}
          className="order-3 lg:order-2 flex w-full lg:max-w-md items-center rounded-lg border border-zinc-200 bg-[#f5f5f7]/80 overflow-hidden focus-within:border-zinc-900 focus-within:bg-white transition-colors"
        >
          <input
            type="search"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearchChange) {
                onSearchChange(e.target.value);
              }
            }}
            placeholder="Buscar funda, modelo, cable, audífonos..."
            className="h-9.5 flex-1 bg-transparent px-3.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none"
            aria-label="Buscar productos"
          />
          <button
            type="submit"
            className="inline-flex h-9.5 items-center gap-1.5 bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-orange-500 transition-colors cursor-pointer"
            aria-label="Buscar"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>

        {/* Acciones: Favoritos + Carrito */}
        <div className="order-2 lg:order-3 flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleFavoritesClick}
            className="relative inline-flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-zinc-200/80 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-500 transition-colors cursor-pointer"
            aria-label={`Ver favoritos (${favorites.length})`}
            title="Favoritos"
          >
            <Heart className="h-4.5 w-4.5" />
            {favorites.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={openCartDrawer}
            className="inline-flex h-9.5 items-center gap-2.5 rounded-lg border border-zinc-200/80 bg-[#f5f5f7]/80 px-3 hover:border-zinc-900 hover:bg-white transition-colors cursor-pointer"
            aria-label={`Abrir carrito (${cartSummary.totalItems} productos)`}
          >
            <span className="relative text-orange-500">
              <ShoppingBag className="h-4.5 w-4.5 stroke-[2]" />
              {cartSummary.totalItems > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-bold text-white">
                  {cartSummary.totalItems}
                </span>
              )}
            </span>
            <span className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] font-medium text-zinc-400">Pedido</span>
              <span className="text-xs font-bold text-zinc-900 mt-0.5">
                {cartSummary.subtotal > 0
                  ? formatPricePEN(cartSummary.subtotal)
                  : 'S/ 0'}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Navegación móvil compacta (solo 3 enlaces) */}
      <nav
        className="flex md:hidden items-center justify-center gap-6 border-t border-zinc-100 px-4 py-2"
        aria-label="Navegación móvil"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`text-xs font-semibold ${
              item.active ? 'text-orange-500' : 'text-zinc-600'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
};
