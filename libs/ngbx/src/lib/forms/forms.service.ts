import {Injectable} from '@angular/core';

import {getMetadataStorage, ValidationTypes} from 'class-validator';
import {ValidationMetadata} from 'class-validator/types/metadata/ValidationMetadata';
import {MAPPERS, TYPE_MAPPING} from './forms.constants';
import {InputProperties, InputType} from './input-properties.interface';
import {getPresentation} from './presentation.decorator';


@Injectable({
  providedIn: 'root',
})
export class FormsService {

  constructor() {
  }

  parse<T extends object>(ctor: Function, properties?: (keyof T)[]): InputProperties[] {
    let storage = getMetadataStorage();
    let metadata = storage.getTargetValidationMetadatas(ctor, ctor.name, false, false);
    let grouped = storage.groupByPropertyName(metadata);
    let entries = Object.entries(grouped);
    if (properties) {
      const propertySet = new Set(properties);
      entries = entries.filter(([key]) => propertySet.has(key as keyof T));
    }
    return entries.map(([key, metadata]) => {
      const customProps = getPresentation(ctor.prototype, key);
      const props: InputProperties = {
        label: key,
        control: 'input',
        ...customProps,
        id: key,
        type: 'text',
        required: true,
        pattern: '',
        minLength: 0,
        maxLength: 512 * 1024,
        max: null,
        min: null,
        step: null,
      };
      for (let m of metadata) {
        this.translateMetadata(m, props);
      }
      return props;
    });
  }

  private translateMetadata(m: ValidationMetadata, props: InputProperties) {
    if (!m.name) {
      return;
    }

    if (m.name in TYPE_MAPPING) {
      props.type = TYPE_MAPPING[m.name];
    }

    if (m.name in MAPPERS) {
      MAPPERS[m.name](props, ...(m.constraints ?? []));
    }

    if (m.type === ValidationTypes.CONDITIONAL_VALIDATION) {
      // TODO check for IsOptional
      props.required = false;
    }
  }

  coerce(type: InputType, value: any) {
    switch (type) {
      case 'number':
        return +value;
      default:
        return value;
    }
  }
}
