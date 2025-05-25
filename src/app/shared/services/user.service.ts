import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../features/auth/interfaces/register.interface';
import {
  BehaviorSubject,
  Observable,
  tap,
  delay,
  catchError,
  throwError,
  from,
  mergeMap,
  toArray,
} from 'rxjs';
import { Login } from '../../features/auth/interfaces/login.interface';
import { ResponseAccess } from '../../features/auth/interfaces/responseAccess.interface';
import { Router } from '@angular/router';
import { Role } from '../../features/auth/enums/role.enum';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { Status } from '@features/auth/enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = environment.apiUrl;
  private tokenKey = environment.tokenKey;
  private currentUser = environment.currentUser;
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private jwtHelper = new JwtHelperService();

  users: User[] = [];

  constructor() {
    const storedUser = localStorage.getItem(this.currentUser);
    this._currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this._currentUserSubject.asObservable();
  }

  // Method to register the user
  registerUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/register`, formData);
  }

  // Method to login the user
  loginUser(loginUser: Login): Observable<ResponseAccess> {
    return this.http
      .post<ResponseAccess>(`${this.API_URL}/auth/login`, loginUser)
      .pipe(
        delay(150),
        tap((response) => {
          if (response && response.user.status === Status.ACTIVE) {
            this.setToken(response.token);
            this._currentUserSubject.next(response.user);
            this.saveUser(response.user);
          } else {
            this.handleFailedLogin();
            throw new Error('Invalid login');
          }
        }),
        catchError((error) => {
          this.handleFailedLogin();
          return throwError(() => error);
        })
      );
  }

  // Method to get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  // Method to delete a user
  deleteUser(id: number, token: string | null): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'applicaction/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<User>(`${this.API_URL}/users/${id}`, { headers });
  }

  // Method to delete multiple users
  deleteUsers(userIds: number[]): Observable<any> {
    // Verificaciones de autenticación
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }

    // Get a token
    const token = this.getToken();

    // If your backend only accepts one ID at a time, we make multiple requests
    return from(userIds).pipe(
      mergeMap((id) => this.deleteUser(id, token)),
      toArray() // Wait for all requests to complete
    );
  }

  // Method to updateUser
  updateUser(
    user: FormData | Omit<User, 'id' | 'password' | 'createdAt'>,
    id: number,
    token: string | null
  ): Observable<User> {

    // Verify token
    if (!token) {
      return throwError(() => new Error('Authentication token is required'));
    }

    // Get a headers with a token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      if (user instanceof FormData) {
        return this.handleFormDataUpdate(user, id, headers);
      } else {
        return this.handleJsonUpdate(user, id, headers);
      }
    } catch (error) {
      return throwError(() => error);
    }
  }

   // Method to handle response if the payload is a Form Data
  private handleFormDataUpdate(
    formData: FormData,
    id: number,
    headers: HttpHeaders
  ): Observable<User> {
    const validatedFormData = this.prepareValidatedFormData(formData);

    return this.http.patch<User>(
      `${this.API_URL}/users/${id}`,
      validatedFormData,
      { headers }
    );
  }

  // Method to handle response if the payload is a JSON
  private handleJsonUpdate(
    userData: Omit<User, 'id' | 'password' | 'createdAt'>,
    id: number,
    headers: HttpHeaders
  ): Observable<User> {
    const validatedData = {
      ...userData,
      role: this.validateAndNormalizeRoles(userData.role),
    };

    return this.http.patch<User>(`${this.API_URL}/users/${id}`, validatedData, {
      headers: headers.set('Content-Type', 'application/json'),
    });
  }

  // Method to validate a FormData
  private prepareValidatedFormData(formData: FormData): FormData {
    const rolesValue = formData.getAll('role[]'); // We use getAll to get all the values
    const validatedRoles = this.validateAndNormalizeRoles(rolesValue);

    // Delete existing roles
    formData.delete('role[]');

    // Add validated roles
    validatedRoles.forEach((role) => {
      formData.append('role[]', role);
    });

    return formData;
  }

  //Method to validate and normalize roles (reusable)
  private validateAndNormalizeRoles(roles: unknown): Role[] {
    //If there are no roles, return USER by default
    if (!roles) return [Role.USER];

    // Make sure it is an array
    const rolesArray = Array.isArray(roles) ? roles : [roles];

    // Validate each role
    const validRoles = rolesArray.filter((role): role is Role =>
      Object.values(Role).includes(role as Role)
    );

    if (validRoles.length !== rolesArray.length) {
      throw new Error('Invalid role values provided');
    }

    // Delete duplicates
    return [...new Set(validRoles)];
  }

  // Method to handle failed login
  handleFailedLogin(): void {
    this.removeToken();
    this._currentUserSubject.next(null);
  }

  // Method to update user status
  updateUserStatus(status: Status): void {
    const currentUser = this._currentUserSubject.value;
    if (currentUser) {
      this._currentUserSubject.next({ ...currentUser, status });
    }
  }

  // Method to get user by ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }

  // Method to get current user role
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

  // Method to forgot password
  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/auth/forgot-password`, {
      email,
    });
  }

  // Method to reset the password
  resetPassword(token: string | null, formData: User): Observable<string> {
    return this.http
      .post<string>(`${this.API_URL}/auth/reset-password`, {
        token,
        newPassword: formData.password,
      })
      .pipe(
        catchError((error) => {
          let errorMsg = 'Unknown Error';
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.status === 400) {
            errorMsg = 'Invalid token or expired';
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  // Method to set the token in local storage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Method to save the user in local storage
  private saveUser(user: User): void {
    localStorage.setItem(this.currentUser, JSON.stringify(user));
  }

  // Method to get the token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  // Method to check if the token is expired
  private removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Method to check if the user is active
  isUserActive(): boolean {
    return this._currentUserSubject.value?.status === Status.ACTIVE;
  }

  // Method to logout the user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUser);
    this.router.navigateByUrl('/login');
  }
}
