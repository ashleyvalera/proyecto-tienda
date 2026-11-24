import type { InquiryRepository } from '@domain/inquiries/inquiry.repository';
import {
  InquiryRecordSchema,
  type CreateInquiryInput,
  type InquiryRecord,
} from '@domain/inquiries/inquiry.schema';
import type { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseInquiryRepository implements InquiryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(input: CreateInquiryInput): Promise<InquiryRecord> {
    const { data, error } = await this.client
      .from('inquiries')
      .insert({
        customer_name: input.customerName || null,
        device_model: input.deviceModel || null,
        message: input.message,
        source: input.source,
      })
      .select('id, message, created_at')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'No se pudo guardar la consulta en Supabase.');
    }

    return InquiryRecordSchema.parse({
      id: data.id,
      message: data.message,
      createdAt: data.created_at,
    });
  }
}
