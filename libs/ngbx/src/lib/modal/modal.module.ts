import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    ModalComponent,
  ],
  exports: [
    ModalComponent,
  ],
})
export class ModalModule {
}
