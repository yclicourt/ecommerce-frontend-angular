import { INTENT } from '../enums/intent.enum';

export interface PurchaseUnits {
  references_id?: string | number;
  amount: {
    currency_code: string;
    value: string;
    breakdown?: {
      item_total: {
        currency_code: string;
        value: string | number;
      };
    };
  };
  items?: Array<{
    name: string;
    unit_amount: {
      value: string;
      currency_code?: string;
    };
    quantity: string | number;
    description?: string;
  }>;
}
