import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = 'http://localhost:4000/api/v1/products';

  products: Product[];

  constructor(private http: HttpClient) {
    this.products = [];
  }

  createProduct(product: Product) {
    return this.http.post<Product>(this.API_URL, product);
  }
  
  getAllProducts() {
    return this.http.get<Product[]>(this.API_URL);
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete<Product>(`${this.API_URL}/${id}`);
  }
}
