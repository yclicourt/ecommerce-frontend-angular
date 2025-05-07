import { Usuario } from "./register.interface";


export interface Login extends Omit<Usuario ,'lastname' | 'name' | 'address' > {
  email: string;
  password: string;
}
