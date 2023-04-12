import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './modal.component';


@NgModule({
  declarations: [
    ModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModalModule,
  ],
  exports: [
    ModalComponent,
  ],
})
export class ModalModule {
}
