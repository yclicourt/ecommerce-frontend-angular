import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/Product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = `${environment.apiUrl}/products`;

  products: Product[];

  constructor(private http: HttpClient) {
    this.products = [];
  }

  // Method to create a new product
  createProduct(product: Product, token: string | null): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Product>(this.API_URL, product, { headers });
  }

  // Method to get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  // Method to get a product by ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  // Method to update a product
  updateProduct(
    product: Omit<Product, 'id'>,
    id: number,
    token: string | null
  ): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<Product>(`${this.API_URL}/${id}`, product, {
      headers,
    });
  }

  // Method to delete a product
  deleteProduct(id: number, token: string | null): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<Product>(`${this.API_URL}/${id}`, { headers });
  }
}
