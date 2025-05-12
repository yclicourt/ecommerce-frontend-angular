import { Usuario } from './register.interface';

export interface Login
  extends Omit<Usuario, 'lastname' | 'name' | 'address' | 'role'> {
  email: string;
  password: string;
}
