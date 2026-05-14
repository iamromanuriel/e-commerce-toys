import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly message = signal<string | null>(null);
  private clearHandle: ReturnType<typeof setTimeout> | undefined;

  show(text: string, durationMs = 3800): void {
    if (this.clearHandle !== undefined) {
      clearTimeout(this.clearHandle);
    }
    this.message.set(text);
    this.clearHandle = setTimeout(() => {
      this.message.set(null);
      this.clearHandle = undefined;
    }, durationMs);
  }
}
