import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { createOrderUseCase } from '@application/orders/create-order.usecase';
import type { CartItem } from '@domain/cart/cart.schema';
import { formatPricePEN } from '@domain/products/product.rules';
import { STORE_INFO } from '@domain/shared/store.constants';
import {
  calculateCartSummary,
  clearCart,
  readCart,
  removeCartItem,
  subscribeCart,
  updateCartQuantity,
} from './cart.store';

export const CartDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  useEffect(() => {
    setItems(readCart());
    return subscribeCart(setItems, () => {
      setSuccessUrl(null);
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const { subtotal, totalItems, hasQuoteItems } = calculateCartSummary(items);

  async function handleCheckout(event: React.SyntheticEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});

    const result = await createOrderUseCase({
      customerName,
      customerPhone,
      deviceModel,
      notes,
      items,
    });

    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      return;
    }

    setSuccessUrl(result.whatsappUrl);
    clearCart();
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
    setNotes('');
    window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-bold text-zinc-900">
              Tu pedido ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {successUrl ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                ¡Pedido listo para coordinar!
              </h3>
              <p className="mt-2 text-sm text-zinc-600 max-w-xs">
                Si WhatsApp no se abrió automáticamente, haz clic abajo para
                enviar tu pedido a <strong>{STORE_INFO.name}</strong>.
              </p>
              <a
                href={successUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Abrir WhatsApp
              </a>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <p className="text-base font-semibold text-zinc-900">
                Tu carrito está vacío
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Agrega fundas, cables, cargadores o audífonos desde el catálogo.
              </p>
              <a
                href="/catalogo"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Explorar catálogo
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="divide-y divide-zinc-100">
                {items.map((item) => {
                  const unitTotal =
                    item.unitPrice !== null
                      ? item.unitPrice + (item.withMica ? item.micaAddonPrice : 0)
                      : null;

                  return (
                    <li key={item.key} className="flex gap-3.5 py-3.5 first:pt-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-18 w-18 shrink-0 rounded-xl bg-[#f5f5f7] object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {item.subtype}
                              {item.withMica ? ' · + Mica de vidrio (S/ 10)' : ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCartItem(item.key)}
                            className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-zinc-900">
                            {unitTotal !== null
                              ? formatPricePEN(unitTotal * item.quantity)
                              : 'Consultar'}
                          </span>
                          <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.key, -1)}
                              className="p-1.5 text-zinc-600 hover:text-zinc-900 cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.key, 1)}
                              className="p-1.5 text-zinc-600 hover:text-zinc-900 cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Resumen */}
              <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">Total estimado</span>
                  <span className="text-lg font-bold text-zinc-900">
                    {subtotal > 0 ? formatPricePEN(subtotal) : 'Por cotizar'}
                  </span>
                </div>
                {hasQuoteItems && (
                  <p className="mt-1.5 text-xs text-zinc-500">
                    Incluye productos con precio a consultar; te confirmaremos por
                    WhatsApp.
                  </p>
                )}
              </div>

              {/* Formulario de pedido validado con Zod */}
              <form onSubmit={handleCheckout} className="space-y-3.5" noValidate>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Datos para coordinar por WhatsApp
                </p>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. María Pérez"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
                  />
                  {fieldErrors.customerName && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Tu WhatsApp / Celular *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej. 987 654 321"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
                  />
                  {fieldErrors.customerPhone && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.customerPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Modelo de celular (opcional)
                  </label>
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="Ej. Samsung Galaxy A54 / iPhone 15"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Nota adicional (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Color preferido o consulta adicional"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  {submitting ? 'Registrando pedido...' : 'Enviar pedido por WhatsApp'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
