import {JsonPipe} from '@angular/common';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {ValidatorFormComponent} from '@nestx/ngbx';
import {Person} from './person';

@Component({
  selector: 'nestx-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  imports: [ValidatorFormComponent, JsonPipe],
})
export class FormsComponent {
  Person = Person;

  person = new Person();

  @ViewChildren(ValidatorFormComponent)
  forms!: QueryList<ValidatorFormComponent<Person>>;

  validate() {
    for (const form of this.forms) {
      form.validateAll();
    }
  }
}
