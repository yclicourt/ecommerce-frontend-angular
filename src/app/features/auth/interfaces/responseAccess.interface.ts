import { User } from './register.interface';

export interface ResponseAccess {
  token: string;
  user: User;
}
