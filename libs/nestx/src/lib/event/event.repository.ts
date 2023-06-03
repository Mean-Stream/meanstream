/* eslint-disable @typescript-eslint/ban-types,no-prototype-builtins */

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
  }
}
