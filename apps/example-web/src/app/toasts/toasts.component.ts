import {Component} from '@angular/core';
import {ToastService} from '@nestx/ngbx';

@Component({
  selector: 'nestx-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css'],
  standalone: false,
})
export class ToastsComponent {

  constructor(
    private toastService: ToastService,
  ) {
  }

  toast() {
    this.toastService.add({
      title: 'Important', // optional
      body: 'Hello world', // optional
      class: 'bg-primary text-white', // optional, can also be object or array
      delay: 1500, // in ms, defaults to 5000
      actions: [ // optional
        {
          name: 'Click me',
          run: () => {
            this.success();
          },
        },
      ],
    });
  }

  success() {
    this.toastService.success('Account', 'Successfully created account');
  }

  warning() {
    this.toastService.warn('Account', 'Successfully deleted account');
  }

  error() {
    this.toastService.error('Account', 'Failed to delete account', new Error());
  }
}
