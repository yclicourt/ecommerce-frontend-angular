import { Role } from './role.enum';

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  phone: number;
  createdAt: Date;
  role?: Role[];
}
export { Role };
