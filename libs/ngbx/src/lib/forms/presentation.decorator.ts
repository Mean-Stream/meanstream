import 'reflect-metadata';
import {CustomProperties} from './input-properties.interface';

export function Presentation<T>(props: CustomProperties<T>): PropertyDecorator {
  return (target, key) => {
    Reflect.defineMetadata('ngbx-presentation', props, target, key);
  };
}

export function getPresentation<T>(target: object, key: string): CustomProperties<T> {
  return Reflect.getMetadata('ngbx-presentation', target, key);
}
