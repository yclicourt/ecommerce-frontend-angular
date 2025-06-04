import { StatusPaypal } from '../enums/status-paypal.enum';

export interface CaptureOrderResponse {
  id?: string;
  statusTransactions: StatusPaypal;
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: StatusPaypal;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
    items: Array<{
      name: string;
      unit_amount: {
        value: string;
        currency_code?: string;
      };
      quantity: string | number;
      description?: string;
    }>;
  }>;
  payer: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
}
