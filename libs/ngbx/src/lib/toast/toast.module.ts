import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastListComponent} from './toast-list/toast-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbToastModule,
    ToastListComponent,
  ],
  exports: [
    ToastListComponent,
  ],
})
export class ToastModule {
}
