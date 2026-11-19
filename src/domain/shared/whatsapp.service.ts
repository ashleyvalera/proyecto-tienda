import type { CartItem } from '../cart/cart.schema';
import type { Product } from '../products/product.schema';
import { calculateUnitPrice, formatPricePEN } from '../products/product.rules';
import { STORE_INFO } from './store.constants';

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildSingleProductMessage(product: Product, withMica: boolean): string {
  const unitPrice = calculateUnitPrice(product, withMica);

  if (product.supportsMicaAddon) {
    const micaDetail = withMica
      ? `con mica de vidrio (+ ${STORE_INFO.currency} ${product.micaAddonPrice})`
      : 'sin mica';
    const priceText =
      unitPrice === null
        ? 'Quisiera consultar precio y disponibilidad.'
        : `Total: ${formatPricePEN(unitPrice)}.`;

    return `Hola, me interesa ${product.name} (${micaDetail}). ${priceText}`;
  }

  const priceText =
    unitPrice === null
      ? 'Quisiera consultar el precio.'
      : `Precio: ${formatPricePEN(unitPrice)}.`;

  return `Hola, me interesa ${product.name}. ${priceText}`;
}

export function buildCartOrderMessage(params: {
  customerName: string;
  customerPhone: string;
  deviceModel?: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  hasQuoteItems: boolean;
}): string {
  const lines: string[] = [
    `Hola *${STORE_INFO.name}*, quiero coordinar mi pedido:`,
    '',
    `👤 *Cliente:* ${params.customerName}`,
    `📱 *Teléfono:* ${params.customerPhone}`,
  ];

  if (params.deviceModel) {
    lines.push(`📲 *Equipo:* ${params.deviceModel}`);
  }

  lines.push('', '*Productos:*');

  for (const item of params.items) {
    const micaLabel = item.withMica ? ' + Mica de vidrio' : '';
    if (item.unitPrice === null) {
      lines.push(`• ${item.quantity}x ${item.name}${micaLabel} — Consultar`);
    } else {
      const unit = item.unitPrice + (item.withMica ? item.micaAddonPrice : 0);
      lines.push(
        `• ${item.quantity}x ${item.name}${micaLabel} — ${formatPricePEN(unit * item.quantity)}`
      );
    }
  }

  lines.push('');
  if (params.hasQuoteItems && params.totalAmount === 0) {
    lines.push('💬 *Total:* Por cotizar');
  } else if (params.hasQuoteItems) {
    lines.push(
      `💰 *Subtotal confirmado:* ${formatPricePEN(params.totalAmount)} (+ productos por cotizar)`
    );
  } else {
    lines.push(`💰 *Total:* ${formatPricePEN(params.totalAmount)}`);
  }

  if (params.notes) {
    lines.push(`📝 *Nota:* ${params.notes}`);
  }

  return lines.join('\n');
}
