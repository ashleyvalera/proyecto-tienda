import type { Product } from '@domain/products/product.schema';
import { getAppContainer } from '../container';

export interface HomeShowcaseData {
  featuredProducts: Product[];
  totalProducts: number;
  categoryCounts: Record<string, number>;
  dataSource: 'supabase' | 'local';
}

export async function getHomeShowcaseUseCase(): Promise<HomeShowcaseData> {
  const { productRepository, dataSource } = getAppContainer();
  const [featuredProducts, allProducts] = await Promise.all([
    productRepository.findFeatured(6),
    productRepository.findAll(),
  ]);

  const categoryCounts = allProducts.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return {
    featuredProducts,
    totalProducts: allProducts.length,
    categoryCounts,
    dataSource,
  };
}
