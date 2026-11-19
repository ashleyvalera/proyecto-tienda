import type { CreateInquiryInput, InquiryRecord } from './inquiry.schema';

export interface InquiryRepository {
  create(input: CreateInquiryInput): Promise<InquiryRecord>;
}
