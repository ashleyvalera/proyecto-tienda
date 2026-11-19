import { CreateInquiryInputSchema } from '@domain/inquiries/inquiry.schema';
import { buildWhatsappUrl } from '@domain/shared/whatsapp.service';
import { getAppContainer } from '../container';

export type SubmitInquiryResult =
  | {
      ok: true;
      whatsappUrl: string;
      persistedInSupabase: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export async function submitInquiryUseCase(
  rawInput: unknown
): Promise<SubmitInquiryResult> {
  const parsed = CreateInquiryInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Por favor verifica tu mensaje.',
    };
  }

  const input = parsed.data;
  const parts: string[] = [];
  if (input.customerName) parts.push(`Hola, soy ${input.customerName}.`);
  if (input.deviceModel) parts.push(`Modelo de celular: ${input.deviceModel}.`);
  parts.push(input.message);

  const whatsappUrl = buildWhatsappUrl(parts.join('\n'));
  const { inquiryRepository, dataSource } = getAppContainer();

  try {
    await inquiryRepository.create(input);
    return {
      ok: true,
      whatsappUrl,
      persistedInSupabase: dataSource === 'supabase',
    };
  } catch (error) {
    console.error('[submitInquiryUseCase] Error guardando consulta:', error);
    return {
      ok: true,
      whatsappUrl,
      persistedInSupabase: false,
    };
  }
}
