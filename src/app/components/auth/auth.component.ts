import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  // Form submission
  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService
        .login(email, password)
        .then(() => {
          this.router.navigate(['/profile']);
        })
        .catch((error: any) => {
          console.error('Login error:', error);
        });
    } else {
      this.authService
        .signUp(email, password)
        .then(() => {
          this.router.navigate(['/profile']);
        })
        .catch((error: any) => {
          console.error('Signup error:', error);
        });
    }
  }

  // Google sign-in
  signInWithGoogle() {
    this.authService
      .LoginWithGoogle()
      .then(() => {
        this.router.navigate(['/profile']);
      })
      .catch((error: any) => {
        console.error('Google login error:', error);
      });
  }

  // Change between login and signup
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }
}
