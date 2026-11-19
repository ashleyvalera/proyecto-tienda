import {
  CartListSchema,
  calculateCartSummary,
  type CartItem,
} from '@domain/cart/cart.schema';
import type { Product } from '@domain/products/product.schema';

const STORAGE_KEY = 'lacasitademathi_cart_v1';
const CART_UPDATED_EVENT = 'mathi:cart-updated';
const CART_OPEN_EVENT = 'mathi:cart-open';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = CartListSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
}

export function openCartDrawer(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));
}

export function addToCart(product: Product, withMica = false): CartItem[] {
  const items = readCart();
  const applyMica = product.supportsMicaAddon && withMica;
  const key = `${product.id}__${applyMica ? 'mica' : 'base'}`;

  const existing = items.find((item) => item.key === key);
  let next: CartItem[];

  if (existing) {
    next = items.map((item) =>
      item.key === key
        ? { ...item, quantity: Math.min(99, item.quantity + 1) }
        : item
    );
  } else {
    next = [
      ...items,
      {
        key,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        subtype: product.subtype,
        imageUrl: product.imageUrl,
        unitPrice: product.price,
        withMica: applyMica,
        micaAddonPrice: applyMica ? product.micaAddonPrice : 0,
        quantity: 1,
      },
    ];
  }

  writeCart(next);
  return next;
}

export function updateCartQuantity(key: string, delta: number): CartItem[] {
  const items = readCart();
  const next = items
    .map((item) =>
      item.key === key ? { ...item, quantity: item.quantity + delta } : item
    )
    .filter((item) => item.quantity > 0);

  writeCart(next);
  return next;
}

export function removeCartItem(key: string): CartItem[] {
  const next = readCart().filter((item) => item.key !== key);
  writeCart(next);
  return next;
}

export function clearCart(): void {
  writeCart([]);
}

export function subscribeCart(
  onUpdate: (items: CartItem[]) => void,
  onOpen?: () => void
): () => void {
  if (!isBrowser()) return () => {};

  const handleUpdate = () => onUpdate(readCart());
  const handleOpen = () => onOpen?.();

  window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);
  if (onOpen) {
    window.addEventListener(CART_OPEN_EVENT, handleOpen);
  }

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
    if (onOpen) {
      window.removeEventListener(CART_OPEN_EVENT, handleOpen);
    }
  };
}

export { calculateCartSummary };
