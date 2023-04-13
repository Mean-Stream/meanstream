import 'reflect-metadata';
import {CustomProperties} from './input-properties.interface';

export function Presentation(props: CustomProperties): PropertyDecorator {
  return (target, key) => {
    Reflect.defineMetadata('ngbx-presentation', props, target, key);
  };
}

export function getPresentation(target: any, key: string): CustomProperties {
  return Reflect.getMetadata('ngbx-presentation', target, key);
}
