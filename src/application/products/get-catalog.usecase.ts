import {
  ProductFilterQuerySchema,
  type Product,
  type ProductFilterQuery,
} from '@domain/products/product.schema';
import {
  extractAvailableBrands,
  extractAvailableSubtypes,
  filterAndSortProducts,
} from '@domain/products/product.rules';
import { getAppContainer } from '../container';

export interface CatalogResult {
  allProducts: Product[];
  filteredProducts: Product[];
  brands: string[];
  subtypes: string[];
  query: ProductFilterQuery;
  dataSource: 'supabase' | 'local';
}

export async function getCatalogUseCase(
  rawQuery: Partial<ProductFilterQuery> = {}
): Promise<CatalogResult> {
  const query = ProductFilterQuerySchema.parse(rawQuery);
  const { productRepository, dataSource } = getAppContainer();
  const allProducts = await productRepository.findAll();

  const categoryPool =
    query.category === 'all'
      ? allProducts
      : allProducts.filter((item) => item.category === query.category);

  return {
    allProducts,
    filteredProducts: filterAndSortProducts(allProducts, query),
    brands: extractAvailableBrands(categoryPool),
    subtypes: extractAvailableSubtypes(categoryPool),
    query,
    dataSource,
  };
}
