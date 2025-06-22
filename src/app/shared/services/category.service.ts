import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '@features/product-feature/interfaces/category.interface';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private API_URL = `${environment.apiUrl}/categories`;

  //Inject services
  private http = inject(HttpClient);
  private userService = inject(UserService)
  constructor() {}

  // Method to get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  // Method to create category
  createCategory(categoryData: { name: string; description?: string; productId: number }): Observable<Category> {
    const token = this.userService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Category>(this.API_URL, categoryData, { headers });
  }

  // Method to get all categories by product
  getCategoriesByProduct(productId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/product/${productId}`);
  }
}
