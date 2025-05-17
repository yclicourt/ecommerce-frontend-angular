import { User } from './register.interface';

export interface Login
  extends Omit<User, 'lastname' | 'name' | 'address' | 'role'> {
  email: string;
  password: string;
}
