import { Usuario } from './register.interface';

export interface ResponseAccess {
  token: string;
  user: Usuario;
}
