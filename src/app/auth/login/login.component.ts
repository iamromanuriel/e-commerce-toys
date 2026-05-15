import { Component ,inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  /** Formulario solo para UI y validación local; no hay llamadas a backend. */
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notifications.show('Revisa el correo y la contraseña (mínimo 6 caracteres).');
      return;
    }

    this.authService.login(this.email.value, this.password.value).then(() => {
      this.router.navigate(['/admin/productos']);
      this.notifications.show('Inicio de sesión correcto.');
      this.loginForm.reset();
    }).catch((error) => {
      this.notifications.show('Error al iniciar sesión. Revisa el correo y la contraseña.');
      console.error('Error al iniciar sesión:', error.message);
    });

    // Vista previa estática: sin autenticación real.
    
  }
}
