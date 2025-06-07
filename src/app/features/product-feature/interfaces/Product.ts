import { Category } from '@features/product-feature/interfaces/category.interface';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categories: Category[];
}
