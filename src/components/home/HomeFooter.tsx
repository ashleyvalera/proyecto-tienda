import React, { useState } from 'react';
import { ArrowRight, Clock, MapPin, MessageCircle, Check } from 'lucide-react';
import { submitInquiryUseCase } from '@application/inquiries/submit-inquiry.usecase';
import { STORE_INFO } from '@domain/shared/store.constants';
import { buildWhatsappUrl } from '@domain/shared/whatsapp.service';

export const HomeFooter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleQuickQuestion(event: React.SyntheticEvent) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const result = await submitInquiryUseCase({
      message,
      source: 'footer_quick_form',
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMsg(result.error);
      return;
    }

    setStatus('sent');
    setMessage('');
    window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <footer id="nosotros" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna 1: Nosotros */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Nosotros</h3>
            <ul className="mt-3.5 space-y-2.5 text-xs text-zinc-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-orange-500 shrink-0" />
                <span>{STORE_INFO.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 mt-0.5 text-orange-500 shrink-0" />
                <span>
                  {STORE_INFO.schedule.weekdays}
                  <br />
                  {STORE_INFO.schedule.sunday}
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Catálogo */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Catálogo</h3>
            <ul className="mt-3.5 space-y-2 text-xs text-zinc-600">
              <li>
                <a href="/catalogo?categoria=fundas" className="hover:text-zinc-950">
                  Fundas (Desde S/ 35)
                </a>
              </li>
              <li>
                <a href="/catalogo?categoria=protectores" className="hover:text-zinc-950">
                  Protectores de vidrio y cámara
                </a>
              </li>
              <li>
                <a href="/catalogo?categoria=cables" className="hover:text-zinc-950">
                  Cables USB-C, Lightning y V8
                </a>
              </li>
              <li>
                <a href="/catalogo?categoria=cargadores" className="hover:text-zinc-950">
                  Cargadores rápidos y auto
                </a>
              </li>
              <li>
                <a href="/catalogo?categoria=audifonos" className="hover:text-zinc-950">
                  Audífonos inalámbricos y cable
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Atención */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Pedidos y ayuda</h3>
            <ul className="mt-3.5 space-y-2 text-xs text-zinc-600">
              <li>
                <a href="/catalogo" className="hover:text-zinc-950">
                  Explorar todo el catálogo
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsappUrl(STORE_INFO.defaultWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950"
                >
                  WhatsApp: {STORE_INFO.whatsappDisplay}
                </a>
              </li>
              <li className="text-zinc-500">
                Fundas para iPhone a pedido y asesoría 1 a 1.
              </li>
            </ul>
          </div>

          {/* Columna 4: Haz una pregunta (input + botón naranja con flecha como la referencia) */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Haz una consulta</h3>
            <form onSubmit={handleQuickQuestion} className="mt-3.5" noValidate>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="Ej. ¿Tienen funda para iPhone 15?"
                  className="h-9 flex-1 rounded-md border border-zinc-300 px-3 text-xs text-zinc-900 outline-none focus:border-orange-500"
                  aria-label="Escribe tu consulta"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60 transition-colors cursor-pointer"
                  aria-label="Enviar consulta por WhatsApp"
                >
                  {status === 'sent' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
              {status === 'error' && (
                <p className="mt-1.5 text-[11px] text-red-600">{errorMsg}</p>
              )}
              {status === 'sent' && (
                <p className="mt-1.5 text-[11px] text-emerald-600">
                  Consulta registrada. Abriendo WhatsApp...
                </p>
              )}
            </form>

            <div className="mt-4 flex items-center gap-2.5">
              <a
                href={buildWhatsappUrl(STORE_INFO.defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp directo
              </a>
            </div>

            <p className="mt-5 text-[10px] leading-relaxed text-zinc-400">
              &copy; {new Date().getFullYear()} {STORE_INFO.name}. Todos los precios en soles
              peruanos (S/). Atención cercana en {STORE_INFO.address}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
