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

  createProduct(product: Product, token: string | null): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Product>(this.API_URL, product, { headers });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

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

  deleteProduct(id: number, token: string | null): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<Product>(`${this.API_URL}/${id}`, { headers });
  }
}
