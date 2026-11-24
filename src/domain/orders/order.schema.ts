import { z } from 'zod';
import { CartItemSchema } from '../cart/cart.schema';

export const CreateOrderInputSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Ingresa tu nombre (mínimo 2 caracteres).')
    .max(80, 'El nombre es demasiado largo.'),
  customerPhone: z
    .string()
    .trim()
    .min(6, 'Ingresa un número de celular válido.')
    .max(20, 'El número es demasiado largo.')
    .regex(/^[0-9+\s()-]+$/, 'Solo números y signos de teléfono válidos.'),
  deviceModel: z
    .string()
    .trim()
    .max(80, 'Máximo 80 caracteres.')
    .optional()
    .default(''),
  notes: z
    .string()
    .trim()
    .max(300, 'Máximo 300 caracteres.')
    .optional()
    .default(''),
  items: z.array(CartItemSchema).min(1, 'Tu carrito está vacío.'),
});

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

export const OrderRecordSchema = z.object({
  id: z.string().min(1),
  customerName: z.string(),
  customerPhone: z.string(),
  deviceModel: z.string().nullable(),
  notes: z.string().nullable(),
  totalAmount: z.number().nonnegative(),
  hasQuoteItems: z.boolean(),
  status: z.enum(['pending_whatsapp', 'confirmed', 'completed', 'cancelled']),
  createdAt: z.string(),
});

export type OrderRecord = z.infer<typeof OrderRecordSchema>;
