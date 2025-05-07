import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role, Usuario } from '../../auth/interfaces/register.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Login } from '../../auth/interfaces/login.interface';
import { ResponseAccess } from '../../auth/interfaces/responseAccess.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:4000/api/v1/auth';
  private tokenKey = 'tokenKey';
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;
  userRole!: Usuario;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<Usuario>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  registerUser(registerUser: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/register`, registerUser);
  }
  loginUser(loginUser: Login): Observable<ResponseAccess> {
    return this.http
      .post<ResponseAccess>(`${this.API_URL}/login`, loginUser)
      .pipe(
        tap((response) => {
          if (response.token) {
            console.log(response.token);
            this.setToken(response.token);
          }
        })
      );
  }

  hasRole(): boolean {
    const user = this.currentUserValue;
    if (user.role == Role.ADMIN) {
      return true;
    } else {
      return false;
    }
  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['login']);
  }
}
