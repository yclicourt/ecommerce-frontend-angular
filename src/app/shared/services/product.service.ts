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

  getAllProducts() {
    return this.http.get<Product[]>(this.API_URL);
  }
}
