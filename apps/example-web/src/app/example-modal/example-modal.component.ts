import {Component} from '@angular/core';
import {ModalComponent} from '@nestx/ngbx';

@Component({
  selector: 'nestx-example-modal',
  templateUrl: './example-modal.component.html',
  styleUrls: ['./example-modal.component.css'],
  imports: [ModalComponent],
})
export class ExampleModalComponent {}
