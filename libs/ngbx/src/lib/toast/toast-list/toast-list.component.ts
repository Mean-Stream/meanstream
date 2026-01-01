import {Component, inject, Input} from '@angular/core';
import {ToastService} from '../toast.service';

@Component({
  selector: 'ngbx-toast-list',
  templateUrl: './toast-list.component.html',
  styleUrls: ['./toast-list.component.scss'],
  standalone: false,
})
export class ToastListComponent {
  @Input() top: string | number = 0;

  protected toastService = inject(ToastService);
}
