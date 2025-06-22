import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../features/product-feature/interfaces/Product';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API_URL = `${environment.apiUrl}/products`;

  products: Product[];
  // Inject Services
  private http = inject(HttpClient);

  constructor() {
    this.products = [];
  }

  // Method to create a new product
  createProduct(formData: FormData, token: string | null): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Product>(this.API_URL, formData, { headers });
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
    formData: FormData,
    id: number | undefined,
    token: string | null
  ): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<Product>(`${this.API_URL}/${id}`, formData, {
      headers,
    });
  }

  // Method to delete a product
  deleteProduct(id: number, token: string | null): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<Product>(`${this.API_URL}/${id}`, { headers });
  }
}
