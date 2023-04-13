import {Component, Input, OnInit, Type} from '@angular/core';
import {validate, ValidationError} from 'class-validator';
import {FormsService} from '../forms.service';
import {InputProperties} from '../input-properties.interface';

@Component({
  selector: 'ngbx-validator-form',
  templateUrl: './validator-form.component.html',
  styleUrls: ['./validator-form.component.css'],
})
export class ValidatorFormComponent<T extends object> implements OnInit {
  @Input() type?: Type<T>;
  @Input() model!: T;
  @Input() pick?: (keyof T)[];

  fields: InputProperties<T>[] = [];

  errors: Partial<Record<keyof T, string[]>> = {};

  constructor(
    private formsService: FormsService,
  ) {
  }

  ngOnInit(): void {
    this.fields = this.formsService.parse(this.type || this.model.constructor as Type<T>, this.pick);
  }

  validateAll(): void {
    validate(this.model).then(errors => {
      for (const field of this.fields) {
        this.addErrors(errors, field.id);
      }
    });
  }

  validate(field: InputProperties<T>): void {
    const property = field.id;
    this.model[property] = this.formsService.coerce(field.type, this.model[property]);

    validate(this.model).then(errors => {
      this.addErrors(errors, property);
    });
  }

  private addErrors(errors: ValidationError[], property: keyof T) {
    const error = errors.find(e => e.property === property);
    this.errors[property] = Object.values(error?.constraints || {});
  }
}
