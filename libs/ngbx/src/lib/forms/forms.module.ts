import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule as NgFormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorFormComponent} from './validator-form/validator-form.component';


@NgModule({
  imports: [
    CommonModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    NgFormsModule,
    ValidatorFormComponent,
  ],
  exports: [
    ValidatorFormComponent,
  ],
})
export class FormsModule {
}
