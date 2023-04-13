import {Component, QueryList, ViewChildren} from '@angular/core';
import {ValidatorFormComponent} from '@nestx/ngbx';
import {Person} from './person';

@Component({
  selector: 'nestx-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent {
  Person = Person;

  person = new Person();

  @ViewChildren(ValidatorFormComponent)
  forms!: QueryList<ValidatorFormComponent>;

  validate() {
    for (const form of this.forms) {
      form.validateAll();
    }
  }
}
