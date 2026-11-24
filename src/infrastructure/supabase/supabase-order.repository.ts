import type { OrderRepository } from '@domain/orders/order.repository';
import {
  OrderRecordSchema,
  type CreateOrderInput,
  type OrderRecord,
} from '@domain/orders/order.schema';
import type { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(
    input: CreateOrderInput,
    totals: { totalAmount: number; hasQuoteItems: boolean }
  ): Promise<OrderRecord> {
    const { data, error } = await this.client
      .from('orders')
      .insert({
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        device_model: input.deviceModel || null,
        notes: input.notes || null,
        items: input.items,
        total_amount: totals.totalAmount,
        has_quote_items: totals.hasQuoteItems,
        status: 'pending_whatsapp',
      })
      .select('id, customer_name, customer_phone, device_model, notes, total_amount, has_quote_items, status, created_at')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'No se pudo registrar el pedido en Supabase.');
    }

    return OrderRecordSchema.parse({
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      deviceModel: data.device_model,
      notes: data.notes,
      totalAmount: Number(data.total_amount),
      hasQuoteItems: Boolean(data.has_quote_items),
      status: data.status,
      createdAt: data.created_at,
    });
  }
}
