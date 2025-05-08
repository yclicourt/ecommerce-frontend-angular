import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../../auth/interfaces/register.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Login } from '../../auth/interfaces/login.interface';
import { ResponseAccess } from '../../auth/interfaces/responseAccess.interface';
import { Router } from '@angular/router';
import { Role } from '../../auth/interfaces/role.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:4000/api/v1/auth';
  private tokenKey = 'tokenKey';
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<Usuario>;
  private jwtHelper = new JwtHelperService();

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
            this.setToken(response.token);
          }
        })
      );
  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  getCurrentUserRole(): Role {
    const token = this.getToken();
    if (!token) return Role.GUEST;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role || Role.GUEST;
    } catch (e) {
      console.error('Error decoding token', e);
      return Role.GUEST;
    }
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
