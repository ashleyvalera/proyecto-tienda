import { calculateCartSummary } from '@domain/cart/cart.schema';
import {
  CreateOrderInputSchema,
  type CreateOrderInput,
  type OrderRecord,
} from '@domain/orders/order.schema';
import {
  buildCartOrderMessage,
  buildWhatsappUrl,
} from '@domain/shared/whatsapp.service';
import { getAppContainer } from '../container';

export type CreateOrderResult =
  | {
      ok: true;
      order: OrderRecord;
      whatsappUrl: string;
      persistedInSupabase: boolean;
    }
  | {
      ok: false;
      fieldErrors: Record<string, string>;
      formError?: string;
    };

export async function createOrderUseCase(
  rawInput: unknown
): Promise<CreateOrderResult> {
  const parsed = CreateOrderInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      fieldErrors,
      formError: 'Revisa los campos marcados antes de continuar.',
    };
  }

  const input: CreateOrderInput = parsed.data;
  const { subtotal, hasQuoteItems } = calculateCartSummary(input.items);

  const message = buildCartOrderMessage({
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    deviceModel: input.deviceModel,
    notes: input.notes,
    items: input.items,
    totalAmount: subtotal,
    hasQuoteItems,
  });

  const whatsappUrl = buildWhatsappUrl(message);
  const { orderRepository, dataSource } = getAppContainer();

  try {
    const order = await orderRepository.create(input, {
      totalAmount: subtotal,
      hasQuoteItems,
    });

    return {
      ok: true,
      order,
      whatsappUrl,
      persistedInSupabase: dataSource === 'supabase',
    };
  } catch (error) {
    // Incluso si Supabase falla por red/RLS, devolvemos un registro local para no bloquear la venta por WhatsApp
    console.error('[createOrderUseCase] Error guardando pedido:', error);
    return {
      ok: true,
      order: {
        id: `fallback-${Date.now()}`,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deviceModel: input.deviceModel || null,
        notes: input.notes || null,
        totalAmount: subtotal,
        hasQuoteItems,
        status: 'pending_whatsapp',
        createdAt: new Date().toISOString(),
      },
      whatsappUrl,
      persistedInSupabase: false,
    };
  }
}
