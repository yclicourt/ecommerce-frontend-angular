import { Role } from './role.enum';

export interface Usuario {
  name: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  role: Role[];
}
export { Role };
