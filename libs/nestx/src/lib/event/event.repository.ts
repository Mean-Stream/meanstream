/* eslint-disable @typescript-eslint/ban-types,no-prototype-builtins */

import {RawUpsertResult} from "../resource/repository";

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

function replaceImplementation(target: Function, method: string, impl: (this: any, originalMethod: Function, ...args: any[]) => any) {
  const propertyValue = target.prototype[method];
  if (!(propertyValue instanceof Function)) {
    return;
  }

  const descriptor = getMethodDescriptor(target, method);
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    return impl.call(this, originalMethod, ...args);
  };

  Object.defineProperty(target.prototype, method, descriptor);
}

export function EventRepository(): ClassDecorator {
  return target => {
    replaceImplementation(target, 'create', async function (this, originalMethod, ...args) {
      const created = await originalMethod.apply(this, args);
      this.emit('created', created);
      return created;
    });
    replaceImplementation(target, 'update', async function (this, originalMethod, ...args) {
      const updated = await originalMethod.apply(this, args);
      this.emit('updated', updated);
      return updated;
    });
    replaceImplementation(target, 'upsertRaw', async function (this, originalMethod, ...args) {
      const result = await originalMethod.apply(this, args) as RawUpsertResult<unknown>;
      this.emit(result.operation, result.result);
      return result;
    });
    replaceImplementation(target, 'delete', async function (this, originalMethod, ...args) {
      const deleted = await originalMethod.apply(this, args);
      this.emit('deleted', deleted);
      return deleted;
    });
    replaceImplementation(target, 'updateMany', async function (this, originalMethod, filter, update, ...args) {
      const results = await this.findAll(filter, ...args);
      await originalMethod.call(this, filter, ...args);
      for (const result of results) {
        this.emit('updated', result);
      }
      return results;
    });
    replaceImplementation(target, 'deleteMany', async function (this, originalMethod, ...args) {
      const results = await this.findAll(...args);
      await originalMethod.apply(this, args);
      for (const result of results) {
        this.emit('deleted', result);
      }
      return results;
    });
  }
}
