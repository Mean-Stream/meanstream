import {Injectable} from '@angular/core';
import {Toast} from './toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  constructor() {
  }

  add(toast: Toast): Toast {
    this.toasts.push(toast);
    return toast;
  }

  success(title: string, body: string): Toast {
    return this.add({
      title,
      body,
      class: 'bg-success text-light',
    });
  }

  warn(title: string, body: string): Toast {
    return this.add({
      title,
      body,
      class: 'bg-warning text-dark',
    });
  }

  error(title: string, body: string, error?: any): Toast {
    console.error(error);
    if (error) {
      body += ': ' + (error.error?.message ?? error.message ?? error);
    }
    return this.add({
      title,
      body,
      class: 'bg-danger text-light',
    });
  }

  remove(toast: Toast) {
    const index = this.toasts.indexOf(toast);
    if (index >= 0) {
      this.toasts.splice(index, 1);
    }
  }
}
