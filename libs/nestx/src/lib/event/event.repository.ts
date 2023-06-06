/* eslint-disable @typescript-eslint/ban-types,no-prototype-builtins */

import type {Document} from "mongoose";

export function EventRepository(): ClassDecorator {
  return target => {
    decorate(target, 'create', Emit('created'));
    decorate(target, 'update', Emit('updated'));
    decorate(target, 'updateOne', Emit('updated'));
    decorate(target, 'delete', Emit('deleted'));
    decorate(target, 'deleteOne', Emit('deleted'));
    decorate(target, 'upsertRaw', Emit(result => result.operation, result => result.result));

    decorate(target, 'updateMany', (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this, filter, update, ...args) {
        const all = await this.findAll(filter, ...args);
        const result = await originalMethod.call(this, filter, update, ...args);
        for (const result of all) {
          this.emit('updated', result);
        }
        return result;
      };
    });

    decorate(target, 'deleteMany', (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this, ...args) {
        const all = await this.findAll(...args);
        const result = await originalMethod.apply(this, args);
        for (const result of all) {
          this.emit('deleted', result);
        }
        return result;
      };
    });

    decorate(target, 'saveAll', (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this, docs: Document[], ...args) {
        const created = docs.filter(d => d.isNew);
        const updated = docs.filter(d => d.isModified());
        const result = await originalMethod.call(this, docs, ...args);
        for (const doc of created) {
          this.emit('created', doc);
        }
        for (const doc of updated) {
          this.emit('updated', doc);
        }
        return result;
      };
    });

    decorate(target, 'deleteAll', (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this, docs: Document[], ...args) {
        const result = await originalMethod.call(this, docs, ...args);
        for (const doc of docs) {
          this.emit('delete', doc);
        }
        return result;
      };
    });
  }
}

export function Emit(event: string | ((result: any) => string), extractor?: (result: any) => any): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this, ...args) {
      const result = await originalMethod.apply(this, args);
      this.emit(typeof event === 'string' ? event : event(result), extractor ? extractor(result) : result);
      return result;
    };
  };
}

function getMethodDescriptor(target: Function, propertyName: string): TypedPropertyDescriptor<any> {
  if (target.prototype.hasOwnProperty(propertyName))
    return Object.getOwnPropertyDescriptor(target.prototype, propertyName);

  // create a new property descriptor for the base class' method
  return {
    configurable: true,
    enumerable: true,
    writable: true,
    value: target.prototype[propertyName]
  };
}

function decorate(target: Function, method: string, decorator: MethodDecorator) {
  const propertyValue = target.prototype[method];
  if (!(propertyValue instanceof Function)) {
    return;
  }

  let descriptor = getMethodDescriptor(target, method);
  descriptor = decorator(target, method, descriptor) || descriptor;
  Object.defineProperty(target.prototype, method, descriptor);
}
