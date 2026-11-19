import { STORE_INFO } from '../shared/store.constants';
import type { Product, ProductFilterQuery } from './product.schema';

export function formatPricePEN(price: number | null): string {
  if (price === null) {
    return 'Consultar';
  }
  return `${STORE_INFO.currency} ${Number.isInteger(price) ? price : price.toFixed(2)}`;
}

export function calculateUnitPrice(product: Product, withMica: boolean): number | null {
  if (product.price === null) {
    return null;
  }
  const addon = product.supportsMicaAddon && withMica ? product.micaAddonPrice : 0;
  return product.price + addon;
}

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterAndSortProducts(
  products: Product[],
  query: ProductFilterQuery
): Product[] {
  const searchNorm = normalizeText(query.search);

  const filtered = products.filter((product) => {
    if (!product.inStock) return false;
    if (query.category !== 'all' && product.category !== query.category) return false;
    if (query.brand && product.brand !== query.brand) return false;
    if (query.subtype && product.subtype !== query.subtype) return false;
    if (query.onlyWithPrice && product.price === null) return false;

    if (searchNorm) {
      const haystack = normalizeText(
        `${product.name} ${product.brand} ${product.subtype} ${product.deviceModel ?? ''} ${product.category}`
      );
      if (!haystack.includes(searchNorm)) return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (query.sortBy) {
      case 'price_asc': {
        const priceA = a.price ?? Number.POSITIVE_INFINITY;
        const priceB = b.price ?? Number.POSITIVE_INFINITY;
        return priceA - priceB;
      }
      case 'price_desc': {
        const priceA = a.price ?? -1;
        const priceB = b.price ?? -1;
        return priceB - priceA;
      }
      case 'rating':
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case 'popular':
      default:
        return a.sortOrder - b.sortOrder || b.reviewCount - a.reviewCount;
    }
  });
}

export function extractAvailableBrands(products: Product[]): string[] {
  const priority = ['Samsung', 'Motorola', 'Xiaomi', 'Apple', 'Universal'];
  const unique = Array.from(new Set(products.map((p) => p.brand)));
  return unique.sort((a, b) => {
    const idxA = priority.indexOf(a);
    const idxB = priority.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
}

export function extractAvailableSubtypes(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.subtype)));
}
