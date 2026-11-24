import React, { useEffect, useMemo, useState } from 'react';
import {
  Cable,
  Headphones,
  Heart,
  LayoutGrid,
  List,
  MessageCircle,
  Shield,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { HomeFooter } from '@components/home/HomeFooter';
import { StoreHeader } from '@components/shared/StoreHeader';
import { useFavorites } from '@components/shared/favorites.store';
import {
  ProductCategorySchema,
  ProductFilterQuerySchema,
  type Product,
  type ProductCategory,
  type SortOption,
} from '@domain/products/product.schema';
import {
  extractAvailableBrands,
  extractAvailableSubtypes,
  filterAndSortProducts,
} from '@domain/products/product.rules';
import { CATEGORY_META } from '@domain/shared/store.constants';
import { buildWhatsappUrl } from '@domain/shared/whatsapp.service';
import { ProductCard } from './ProductCard';

interface CatalogExplorerProps {
  initialProducts: Product[];
  dataSource: 'supabase' | 'local';
}

type SidebarKey = 'all' | ProductCategory | 'favorites';

const SIDEBAR_ITEMS: {
  key: SidebarKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'all', label: 'Todo el catálogo', icon: Sparkles },
  { key: 'fundas', label: 'Fundas', icon: Smartphone },
  { key: 'protectores', label: 'Protectores', icon: Shield },
  { key: 'cables', label: 'Cables', icon: Cable },
  { key: 'cargadores', label: 'Cargadores', icon: Zap },
  { key: 'audifonos', label: 'Audífonos', icon: Headphones },
  { key: 'favorites', label: 'Favoritos', icon: Heart },
];

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  initialProducts,
}) => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarKey>('all');
  const [brand, setBrand] = useState('');
  const [subtype, setSubtype] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawCat = params.get('categoria');
    const rawBrand = params.get('marca');
    const rawQ = params.get('q');
    const rawFavs = params.get('favoritos');

    if (rawFavs === '1') {
      setActiveSidebar('favorites');
    } else if (rawCat) {
      const parsedCat = ProductCategorySchema.safeParse(rawCat);
      if (parsedCat.success) {
        setActiveSidebar(parsedCat.data);
      }
    }
    if (rawBrand) setBrand(rawBrand);
    if (rawQ) setSearchQuery(rawQ);
  }, []);

  function handleSelectCategory(key: SidebarKey) {
    setActiveSidebar(key);
    setBrand('');
    setSubtype('');
  }

  const categoryPool = useMemo(() => {
    if (activeSidebar === 'favorites') {
      return initialProducts.filter((p) => favorites.includes(p.id));
    }
    if (activeSidebar === 'all') {
      return initialProducts;
    }
    return initialProducts.filter((p) => p.category === activeSidebar);
  }, [initialProducts, activeSidebar, favorites]);

  const availableBrands = useMemo(
    () => extractAvailableBrands(categoryPool),
    [categoryPool]
  );

  const availableSubtypes = useMemo(
    () => extractAvailableSubtypes(categoryPool),
    [categoryPool]
  );

  const filteredProducts = useMemo(() => {
    const query = ProductFilterQuerySchema.parse({
      category:
        activeSidebar === 'all' || activeSidebar === 'favorites'
          ? 'all'
          : activeSidebar,
      brand,
      subtype,
      search: searchQuery,
      sortBy,
    });
    return filterAndSortProducts(categoryPool, query);
  }, [categoryPool, activeSidebar, brand, subtype, searchQuery, sortBy]);

  const currentHeading =
    activeSidebar === 'all'
      ? 'Catálogo'
      : activeSidebar === 'favorites'
        ? 'Tus Favoritos'
        : CATEGORY_META[activeSidebar].label;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader
        currentPath="/catalogo"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFavorites={() => handleSelectCategory('favorites')}
      />

      {/* Layout Bento Swiss: Sidebar lateral + Filtros superiores + Listado */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col lg:flex-row px-4 sm:px-8 py-6 gap-6">
        {/* Sidebar lateral */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="rounded-xl bg-[#f5f5f7] p-2 lg:p-3 border border-zinc-200/60">
            <nav
              className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar gap-1"
              aria-label="Categorías del catálogo"
            >
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSidebar === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectCategory(item.key)}
                    className={`relative flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-zinc-950 shadow-xs border-l-2 lg:border-l-[3px] border-orange-500'
                        : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-950'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active ? 'text-orange-500' : 'text-zinc-400'
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.key === 'favorites' && favorites.length > 0 && (
                      <span className="ml-auto rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tarjeta Bento de consulta personalizada */}
          <div className="hidden lg:block mt-4 rounded-xl bg-[#f5f5f7] p-4 border border-zinc-200/60">
            <p className="text-xs font-bold text-zinc-900">
              ¿Buscas funda para iPhone u otro modelo?
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
              Escríbenos y te confirmamos stock al instante.
            </p>
            <a
              href={buildWhatsappUrl(
                'Hola, quiero consultar disponibilidad para mi modelo de celular.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Consultar por WhatsApp
            </a>
          </div>
        </aside>

        {/* Contenido derecho: Filtros superiores + Listado */}
        <main className="flex-1 min-w-0">
          <div className="flex items-end justify-between gap-4">
            <h1 className="inline-block border-b-2 border-orange-500 pb-1 text-2xl font-semibold tracking-tight text-zinc-900">
              {currentHeading}
            </h1>
            <p className="text-xs font-semibold text-zinc-500">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          {/* Pills de marcas */}
          {availableBrands.length > 1 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setBrand('')}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                  brand === ''
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-[#f5f5f7] text-zinc-600 hover:bg-white hover:text-zinc-900'
                }`}
              >
                Todas las marcas
              </button>
              {availableBrands.map((itemBrand) => (
                <button
                  key={itemBrand}
                  type="button"
                  onClick={() => setBrand(brand === itemBrand ? '' : itemBrand)}
                  className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                    brand === itemBrand
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-[#f5f5f7] text-zinc-600 hover:bg-white hover:text-zinc-900'
                  }`}
                >
                  {itemBrand}
                </button>
              ))}
            </div>
          )}

          {/* Barra superior de ordenamiento, subtipo y vista Grid/Lista */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-5 text-xs">
              {(
                [
                  { id: 'popular', label: 'Popularidad' },
                  { id: 'price_asc', label: 'Menor precio' },
                  { id: 'price_desc', label: 'Mayor precio' },
                  { id: 'rating', label: 'Valoración' },
                ] as { id: SortOption; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSortBy(tab.id)}
                  className={`relative pb-2 -mb-[13px] font-semibold transition-colors cursor-pointer ${
                    sortBy === tab.id
                      ? 'text-zinc-950 border-b-2 border-orange-500'
                      : 'text-zinc-400 hover:text-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              {availableSubtypes.length > 1 && (
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-[#f5f5f7] px-2.5 py-1.5 text-xs text-zinc-600">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                  <select
                    value={subtype}
                    onChange={(e) => setSubtype(e.target.value)}
                    aria-label="Filtrar por tipo"
                    className="bg-transparent text-xs font-semibold text-zinc-700 outline-none cursor-pointer"
                  >
                    <option value="">Todos los tipos</option>
                    {availableSubtypes.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-[#f5f5f7] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-orange-500 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  aria-label="Vista en lista"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-orange-500 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  aria-label="Vista en cuadrícula"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Listado de productos */}
          {filteredProducts.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl bg-[#f5f5f7] border border-zinc-200/70 py-16 px-6 text-center">
              <p className="text-base font-bold text-zinc-900">
                No encontramos esa combinación
              </p>
              <p className="mt-1.5 text-sm text-zinc-500 max-w-md">
                Prueba limpiando los filtros o escríbenos por WhatsApp y te ayudamos
                a conseguir el accesorio para tu modelo.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSidebar('all');
                    setBrand('');
                    setSubtype('');
                    setSearchQuery('');
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Limpiar filtros
                </button>
                <a
                  href={buildWhatsappUrl(
                    `Hola, estuve buscando "${searchQuery || brand || currentHeading}" en la web y no lo encontré. ¿Me ayudan?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'mt-5 flex flex-col gap-3.5'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <HomeFooter />
    </div>
  );
};
