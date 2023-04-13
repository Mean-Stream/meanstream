import {Injectable, Type} from '@angular/core';

import {getMetadataStorage, ValidationTypes} from 'class-validator';
import {ValidationMetadata} from 'class-validator/types/metadata/ValidationMetadata';
import {MAPPERS, TYPE_MAPPING} from './forms.constants';
import {InputProperties, InputType, ValidationFormOptions} from './input-properties.interface';
import {getPresentation} from './presentation.decorator';


@Injectable({
  providedIn: 'root',
})
export class FormsService {
  parse<T extends object>(ctor: Type<T>, options: ValidationFormOptions<T> = {}): InputProperties<T>[] {
    const storage = getMetadataStorage();
    const metadata = storage.getTargetValidationMetadatas(ctor, ctor.name, false, false);
    const grouped = storage.groupByPropertyName(metadata);
    let entries = Object.entries(grouped);
    if (options.pick) {
      const propertySet = new Set(options.pick);
      entries = entries.filter(([key]) => propertySet.has(key as keyof T));
    }
    if (options.omit) {
      const propertySet = new Set(options.omit);
      entries = entries.filter(([key]) => !propertySet.has(key as keyof T));
    }
    return entries.map(([key, metadata]) => {
      const customProps = getPresentation(ctor.prototype, key);
      const props: InputProperties<T> = {
        label: key,
        control: 'input',
        ...customProps,
        id: key as keyof T,
        type: 'text',
        required: true,
        pattern: '',
        minLength: 0,
        maxLength: 512 * 1024,
        max: null,
        min: null,
        step: null,
      };
      for (const m of metadata) {
        this.translateMetadata(m, props);
      }
      return props;
    });
  }

  private translateMetadata<T>(m: ValidationMetadata, props: InputProperties<T>) {
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
