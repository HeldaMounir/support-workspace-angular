import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly currentUser = signal<User | null>(
    this.getStoredUser()
  );

  readonly user = this.currentUser.asReadonly();

  readonly isAuthenticated = computed(
    () => this.currentUser() !== null
  );

  login(user: User): void {
    localStorage.setItem(
      'support_user',
      JSON.stringify(user)
    );

    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem('support_user');

    this.currentUser.set(null);
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser()?.role === role;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private getStoredUser(): User | null {
    const storedUser =
      localStorage.getItem('support_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem('support_user');
      return null;
    }
  }
}