import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../../features/auth/interfaces/register.interface';
import {
  BehaviorSubject,
  Observable,
  tap,
  delay,
  catchError,
  throwError,
} from 'rxjs';
import { Login } from '../../features/auth/interfaces/login.interface';
import { ResponseAccess } from '../../features/auth/interfaces/responseAccess.interface';
import { Router } from '@angular/router';
import { Role } from '../../features/auth/interfaces/role.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:4000/api/v1';
  private tokenKey = 'tokenKey';
  private currentUser = 'currentUser';
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser$: Observable<Usuario | null>;
  private jwtHelper = new JwtHelperService();

  users: Usuario[] = [];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this._currentUserSubject = new BehaviorSubject<Usuario | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this._currentUserSubject.asObservable();
  }

  registerUser(registerUser: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${this.API_URL}/auth/register`,
      registerUser
    );
  }
  loginUser(loginUser: Login): Observable<ResponseAccess> {
    return this.http
      .post<ResponseAccess>(`${this.API_URL}/auth/login`, loginUser)
      .pipe(
        delay(150),
        tap((response) => {
          if (response) {
            this.setToken(response.token);
            this._currentUserSubject.next(response.user);
            this.saveUser(response.user);
          } else {
            this.removeToken();
            throw new Error('Invalid login');
          }
        }),
        catchError((error) => {
          this.removeToken();
          return throwError(() => error);
        })
      );
  }

  getUser(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/users/${id}`);
  }

  getCurrentUserRole(): Role {
    const token = this.getToken();
    if (!token) return Role.USER;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role || Role.USER;
    } catch (e) {
      console.error('Error decoding token', e);
      return Role.USER;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private saveUser(user: Usuario): void {
    localStorage.setItem(this.currentUser, JSON.stringify(user));
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

  private removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUser);
    this.router.navigateByUrl('/login');
  }
}
