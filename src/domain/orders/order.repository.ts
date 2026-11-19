import type { CreateOrderInput, OrderRecord } from './order.schema';

export interface OrderRepository {
  create(
    input: CreateOrderInput,
    totals: { totalAmount: number; hasQuoteItems: boolean }
  ): Promise<OrderRecord>;
}
