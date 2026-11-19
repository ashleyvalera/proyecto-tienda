import { z } from 'zod';
import type { ProductRepository } from '@domain/products/product.repository';
import {
  ProductSchema,
  type Product,
  type ProductCategory,
} from '@domain/products/product.schema';
import type { SupabaseClient } from '@supabase/supabase-js';

const SupabaseProductRowSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  subtype: z.string(),
  brand: z.string().nullable().optional(),
  device_model: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]).nullable(),
  compare_at_price: z.union([z.number(), z.string()]).nullable().optional(),
  supports_mica_addon: z.boolean().optional(),
  mica_addon_price: z.union([z.number(), z.string()]).optional(),
  image_url: z.string(),
  swatches: z.array(z.string()).nullable().optional(),
  rating: z.union([z.number(), z.string()]).optional(),
  review_count: z.number().int().optional(),
  featured: z.boolean().optional(),
  badge: z.string().nullable().optional(),
  in_stock: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

function toNumericOrNull(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapRowToDomain(raw: unknown): Product | null {
  const rowParsed = SupabaseProductRowSchema.safeParse(raw);
  if (!rowParsed.success) {
    console.warn('[SupabaseProductRepository] Fila inválida omitida:', rowParsed.error.issues);
    return null;
  }

  const row = rowParsed.data;
  const domainParsed = ProductSchema.safeParse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subtype: row.subtype,
    brand: row.brand ?? 'Universal',
    deviceModel: row.device_model ?? null,
    price: toNumericOrNull(row.price),
    compareAtPrice: toNumericOrNull(row.compare_at_price),
    supportsMicaAddon: row.supports_mica_addon ?? false,
    micaAddonPrice: toNumericOrNull(row.mica_addon_price) ?? 10,
    imageUrl: row.image_url,
    swatches: row.swatches ?? [],
    rating: toNumericOrNull(row.rating) ?? 4.8,
    reviewCount: row.review_count ?? 12,
    featured: row.featured ?? false,
    badge: row.badge ?? null,
    inStock: row.in_stock ?? true,
    sortOrder: row.sort_order ?? 100,
  });

  if (!domainParsed.success) {
    console.warn('[SupabaseProductRepository] Error mapeando producto:', domainParsed.error.issues);
    return null;
  }

  return domainParsed.data;
}

export class SupabaseProductRepository implements ProductRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly fallback: ProductRepository
  ) {}

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('[SupabaseProductRepository] Fallback local por error:', error.message);
      }
      return this.fallback.findAll();
    }

    return data.map(mapRowToDomain).filter((item): item is Product => item !== null);
  }

  async findFeatured(limit = 6): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return this.fallback.findFeatured(limit);
    }

    return data.map(mapRowToDomain).filter((item): item is Product => item !== null);
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .eq('category', category)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return this.fallback.findByCategory(category);
    }

    return data.map(mapRowToDomain).filter((item): item is Product => item !== null);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return this.fallback.findBySlug(slug);
    }

    return mapRowToDomain(data);
  }
}
