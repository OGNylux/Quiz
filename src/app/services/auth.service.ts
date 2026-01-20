import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, UserResponse } from './api.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  private async checkAuthStatus() {
    const authData = await Preferences.get({ key: 'auth_user' });
    if (authData.value) {
      const user = JSON.parse(authData.value);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await new Promise<UserResponse>((resolve, reject) => {
        this.apiService.login({ email, password }).subscribe({
          next: (user) => resolve(user),
          error: (error) => reject(error)
        });
      });

      await Preferences.set({
        key: 'auth_user',
        value: JSON.stringify(user)
      });

      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error?.error?.message || 'Login failed. Please check your credentials.' 
      };
    }
  }

  async register(email: string, password: string, repeatPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await new Promise<UserResponse>((resolve, reject) => {
        this.apiService.register({ email, password, repeatPassword }).subscribe({
          next: (user) => resolve(user),
          error: (error) => reject(error)
        });
      });

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error?.error?.message || 'Registration failed. Please try again.' 
      };
    }
  }

  async logout() {
    await Preferences.remove({ key: 'auth_user' });
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }
}
