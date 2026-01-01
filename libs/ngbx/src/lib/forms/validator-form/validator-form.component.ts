import {Component, inject, Input, OnInit, Type} from '@angular/core';
import {validate, ValidationError} from 'class-validator';
import {FormsService} from '../forms.service';
import {InputProperties, ValidationFormOptions} from '../input-properties.interface';

@Component({
  selector: 'ngbx-validator-form',
  templateUrl: './validator-form.component.html',
  styleUrls: ['./validator-form.component.css'],
  standalone: false,
})
export class ValidatorFormComponent<T extends object> implements OnInit {
  @Input() type?: Type<T>;
  @Input() model!: T;
  @Input() options?: ValidationFormOptions<T>;

  fields: InputProperties<T>[] = [];

  errors: Partial<Record<keyof T, string[]>> = {};

  private formsService = inject(FormsService);

  ngOnInit(): void {
    this.fields = this.formsService.parse(this.type || this.model.constructor as Type<T>, this.options);
  }

  async validateAll(): Promise<ValidationError[]> {
    for (const field of this.fields) {
      this.model[field.id] = this.formsService.coerce(field.type, this.model[field.id]);
    }
    const errors = await validate(this.model)
    this.addErrors(errors);
    return errors;
  }

  async validate(field: InputProperties<T>): Promise<ValidationError[]> {
    const property = field.id;
    this.model[property] = this.formsService.coerce(field.type, this.model[property]);

    const allErrors = await validate(this.model);
    const fieldErrors = allErrors.filter(e => e.property === property);
    this.addErrors(fieldErrors);
    return fieldErrors;
  }

  private addErrors(errors: ValidationError[]) {
    for (const error of errors) {
      this.errors[error.property as keyof T] = Object.values(error?.constraints || {});
    }
  }
}
