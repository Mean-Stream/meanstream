import {Component, inject, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../toast.service';

@Component({
  selector: 'ngbx-toast-list',
  templateUrl: './toast-list.component.html',
  styleUrls: ['./toast-list.component.scss'],
  imports: [NgbToast, RouterLink],
})
export class ToastListComponent {
  @Input() top: string | number = 0;

  protected toastService = inject(ToastService);
}
