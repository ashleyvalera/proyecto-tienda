import type { InquiryRepository } from '@domain/inquiries/inquiry.repository';
import type { OrderRepository } from '@domain/orders/order.repository';
import type { ProductRepository } from '@domain/products/product.repository';
import {
  LocalInquiryRepository,
  LocalOrderRepository,
  LocalProductRepository,
} from '@infrastructure/local/local-repositories';
import { getSupabaseClient } from '@infrastructure/supabase/client';
import { SupabaseInquiryRepository } from '@infrastructure/supabase/supabase-inquiry.repository';
import { SupabaseOrderRepository } from '@infrastructure/supabase/supabase-order.repository';
import { SupabaseProductRepository } from '@infrastructure/supabase/supabase-product.repository';

export interface AppContainer {
  productRepository: ProductRepository;
  orderRepository: OrderRepository;
  inquiryRepository: InquiryRepository;
  dataSource: 'supabase' | 'local';
}

let containerInstance: AppContainer | null = null;

export function getAppContainer(): AppContainer {
  if (containerInstance) {
    return containerInstance;
  }

  const supabase = getSupabaseClient();
  const localProducts = new LocalProductRepository();

  if (supabase) {
    containerInstance = {
      productRepository: new SupabaseProductRepository(supabase, localProducts),
      orderRepository: new SupabaseOrderRepository(supabase),
      inquiryRepository: new SupabaseInquiryRepository(supabase),
      dataSource: 'supabase',
    };
  } else {
    containerInstance = {
      productRepository: localProducts,
      orderRepository: new LocalOrderRepository(),
      inquiryRepository: new LocalInquiryRepository(),
      dataSource: 'local',
    };
  }

  return containerInstance;
}
