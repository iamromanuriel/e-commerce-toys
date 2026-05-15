import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

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

  /** Formulario solo para UI y validación local; no hay llamadas a backend. */
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /** Accesos cortos para la plantilla. */
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

    // Vista previa estática: sin autenticación real.
    this.notifications.show('Modo demostración: inicio de sesión simulado correctamente.');
    this.loginForm.reset();
  }
}
