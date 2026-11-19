import type { Product, ProductCategory } from './product.schema';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findFeatured(limit?: number): Promise<Product[]>;
  findByCategory(category: ProductCategory): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
}
