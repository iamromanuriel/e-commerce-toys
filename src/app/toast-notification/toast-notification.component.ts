import { Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  template: `
    @if (notifications.message(); as msg) {
      <div
        role="status"
        aria-live="polite"
        class="pointer-events-none fixed bottom-4 left-1/2 z-[100] w-[min(100%-2rem,28rem)] -translate-x-1/2 px-4 sm:bottom-6"
      >
        <div
          class="pointer-events-auto rounded-2xl border border-slate-200/80 bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg shadow-slate-900/20 sm:text-base"
        >
          {{ msg }}
        </div>
      </div>
    }
  `,
})
export class ToastNotificationComponent {
  readonly notifications = inject(NotificationService);
}
