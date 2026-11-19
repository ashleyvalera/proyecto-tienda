import type { InquiryRepository } from '@domain/inquiries/inquiry.repository';
import type { CreateInquiryInput, InquiryRecord } from '@domain/inquiries/inquiry.schema';
import type { OrderRepository } from '@domain/orders/order.repository';
import type { CreateOrderInput, OrderRecord } from '@domain/orders/order.schema';
import type { ProductRepository } from '@domain/products/product.repository';
import type { Product, ProductCategory } from '@domain/products/product.schema';
import { LOCAL_CATALOG_SEED } from './catalog.seed';

export class LocalProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return [...LOCAL_CATALOG_SEED].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async findFeatured(limit = 6): Promise<Product[]> {
    return LOCAL_CATALOG_SEED.filter((item) => item.featured)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, limit);
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return LOCAL_CATALOG_SEED.filter((item) => item.category === category).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return LOCAL_CATALOG_SEED.find((item) => item.slug === slug) ?? null;
  }
}

export class LocalOrderRepository implements OrderRepository {
  async create(
    input: CreateOrderInput,
    totals: { totalAmount: number; hasQuoteItems: boolean }
  ): Promise<OrderRecord> {
    return {
      id: `local-order-${Date.now()}`,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      deviceModel: input.deviceModel || null,
      notes: input.notes || null,
      totalAmount: totals.totalAmount,
      hasQuoteItems: totals.hasQuoteItems,
      status: 'pending_whatsapp',
      createdAt: new Date().toISOString(),
    };
  }
}

export class LocalInquiryRepository implements InquiryRepository {
  async create(input: CreateInquiryInput): Promise<InquiryRecord> {
    return {
      id: `local-inquiry-${Date.now()}`,
      message: input.message,
      createdAt: new Date().toISOString(),
    };
  }
}
