import { z } from 'zod';

export const ProductCategorySchema = z.enum([
  'fundas',
  'protectores',
  'cables',
  'cargadores',
  'audifonos',
]);

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(2),
  category: ProductCategorySchema,
  subtype: z.string().min(1),
  brand: z.string().min(1).default('Universal'),
  deviceModel: z.string().nullable().default(null),
  price: z.number().nonnegative().nullable(),
  compareAtPrice: z.number().nonnegative().nullable().default(null),
  supportsMicaAddon: z.boolean().default(false),
  micaAddonPrice: z.number().nonnegative().default(10),
  imageUrl: z.string().min(1),
  swatches: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(4.8),
  reviewCount: z.number().int().nonnegative().default(12),
  featured: z.boolean().default(false),
  badge: z.string().nullable().default(null),
  inStock: z.boolean().default(true),
  sortOrder: z.number().int().default(100),
});

export type Product = z.infer<typeof ProductSchema>;

export const SortOptionSchema = z.enum([
  'popular',
  'price_asc',
  'price_desc',
  'rating',
]);

export type SortOption = z.infer<typeof SortOptionSchema>;

export const ProductFilterQuerySchema = z.object({
  category: ProductCategorySchema.or(z.literal('all')).default('all'),
  brand: z.string().trim().default(''),
  subtype: z.string().trim().default(''),
  search: z.string().trim().max(120).default(''),
  sortBy: SortOptionSchema.default('popular'),
  onlyWithPrice: z.boolean().default(false),
});

export type ProductFilterQuery = z.infer<typeof ProductFilterQuerySchema>;
