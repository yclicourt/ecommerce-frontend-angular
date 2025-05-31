import { INTENT } from '../enums/intent.enum';

export interface PurchaseUnits {
  intent: INTENT;
  amount: {
    currency_code: string;
    value: string;
  };
  items?: Array<{
    name: string;
    description: string;
    image_url: string;
  }>;
}
