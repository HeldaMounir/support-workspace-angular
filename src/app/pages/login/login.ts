import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';

  readonly loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  readonly testUsers: User[] = [
    {
      id: 'agent-001',
      name: 'Ahmed Support',
      email: 'agent@example.com',
      role: 'agent'
    },
    {
      id: 'manager-001',
      name: 'Mona Manager',
      email: 'manager@example.com',
      role: 'manager'
    }
  ];

  submit(): void {

    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const {
      email,
      password
    } = this.loginForm.getRawValue();

    // Temporary milestone authentication.
    // Replace with backend authentication later.
    if (password !== '123456') {
      this.errorMessage =
        'Invalid email or password.';

      return;
    }

    const user = this.testUsers.find(
      user => user.email === email
    );

    if (!user) {
      this.errorMessage =
        'No support employee was found with this email.';

      return;
    }

    this.authService.login(user);

    this.router.navigate(['/dashboard']);
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}