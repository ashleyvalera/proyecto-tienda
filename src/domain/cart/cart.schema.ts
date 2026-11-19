import { z } from 'zod';

export const CartItemSchema = z.object({
  key: z.string().min(1),
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  subtype: z.string().min(1),
  imageUrl: z.string().min(1),
  unitPrice: z.number().nonnegative().nullable(),
  withMica: z.boolean().default(false),
  micaAddonPrice: z.number().nonnegative().default(0),
  quantity: z.number().int().min(1).max(99),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartListSchema = z.array(CartItemSchema);

export function calculateCartSummary(items: CartItem[]) {
  let subtotal = 0;
  let totalItems = 0;
  let hasQuoteItems = false;

  for (const item of items) {
    totalItems += item.quantity;
    if (item.unitPrice === null) {
      hasQuoteItems = true;
    } else {
      const unitWithExtra = item.unitPrice + (item.withMica ? item.micaAddonPrice : 0);
      subtotal += unitWithExtra * item.quantity;
    }
  }

  return { subtotal, totalItems, hasQuoteItems };
}
