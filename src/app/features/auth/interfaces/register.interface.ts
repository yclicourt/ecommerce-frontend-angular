import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  phone: number;
  avatar?: string;
  createdAt: Date;
  role?: Role[];
  status?: Status;
}
export { Role };
