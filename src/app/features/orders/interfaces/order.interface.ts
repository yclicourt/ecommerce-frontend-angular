import { INTENT } from '../enums/intent.enum';
import { ApplicationContext } from './application_context.interface';
import { PurchaseUnits } from './purchase_units.interface';

export interface Order {
  id: number;
  intent: INTENT;
  purchase_units: PurchaseUnits[];
  application_context: ApplicationContext;
}
