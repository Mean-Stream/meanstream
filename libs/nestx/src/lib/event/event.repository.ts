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

function decorate(target: Function, method: string, decorator: MethodDecorator) {
  const propertyValue = target.prototype[method];
  if (!(propertyValue instanceof Function)) {
    return;
  }

  let descriptor = getMethodDescriptor(target, method);
  descriptor = decorator(target, method, descriptor) || descriptor;
  Object.defineProperty(target.prototype, method, descriptor);
}

export function EventRepository(): ClassDecorator {
  return target => {
    decorate(target, 'create', Emit('created'));
    decorate(target, 'update', Emit('updated'));
    decorate(target, 'delete', Emit('deleted'));
    decorate(target, 'upsertRaw', Emit(result => result.operation, result => result.result));

    decorate(target, 'updateMany', (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this, filter, update, ...args) {
        const results = await this.findAll(filter, ...args);
        await originalMethod.call(this, filter, ...args);
        for (const result of results) {
          this.emit('updated', result);
        }
        return results;
      };
    });

    decorate(target, 'deleteMany', (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this, ...args) {
        const results = await this.findAll(...args);
        await originalMethod.apply(this, args);
        for (const result of results) {
          this.emit('deleted', result);
        }
        return results;
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

