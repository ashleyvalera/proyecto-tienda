import { z } from 'zod';

export const CreateInquiryInputSchema = z.object({
  customerName: z.string().trim().max(80).optional().default(''),
  deviceModel: z.string().trim().max(80).optional().default(''),
  message: z
    .string()
    .trim()
    .min(4, 'Cuéntanos brevemente qué accesorio o modelo buscas.')
    .max(400, 'El mensaje no puede superar los 400 caracteres.'),
  source: z
    .enum(['footer_quick_form', 'contact_section', 'catalog_empty'])
    .default('footer_quick_form'),
});

export type CreateInquiryInput = z.infer<typeof CreateInquiryInputSchema>;

export const InquiryRecordSchema = z.object({
  id: z.string().min(1),
  message: z.string(),
  createdAt: z.string(),
});

export type InquiryRecord = z.infer<typeof InquiryRecordSchema>;
