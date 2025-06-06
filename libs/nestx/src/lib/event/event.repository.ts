/* eslint-disable @typescript-eslint/ban-types,no-prototype-builtins */

import type {Document} from "mongoose";

/**
 * Adds additional logic to Repository methods to emit events.
 *
 * - `create`, `update`, `updateOne`, `delete`, `deleteOne`: emit `created`, `updated`, `deleted` respectively
 * - `upsertRaw`: emit `created` or `updated` depending on the operation
 * - `createMany`: emit `created` for each document
 * - `updateMany`: emit `updated` for each document.
 *   Note that the operation itself does not return the documents, so an additional `findAll` is done after the update operation.
 *   This may yield slightly different results if the update affects which documents match the filter.
 * - `deleteMany`: emit `deleted` respectively for each document.
 *   Note that the operation itself does not return the documents, so an additional `findAll` is done before the delete operation.
 * - `save` and `saveAll`: emit `created` or `updated` depending on status of the document
 * - `deleteAll`: emit `deleted` for each document
 *
 * Other (read) operations are not affected.
 * Overriding one of the methods and calling `super` will emit the event after the overridden method has finished.
 *
 * Event emit can be skipped by passing an options object with `emit: false` as the last argument.
 * See {@link ModifyOptions.emit}.
 *
 * @example
 * *@EventRepository()
 * class MyRepository extends MongooseRepository {
 *   create(dto: Foo): Promise<Doc<Foo>> {
 *     console.log('before super');
 *     const result = super.create(dto);
 *     console.log('after super');
 *     return result;
 *   }
 *
 *   emit(event: string, data: Foo): void {
 *     console.log('emit', event, data);
 *   }
 * }
 * // myRepo.create(new Foo()) Will log:
 * // - before super
 * // - (Document created in MongoDB)
 * // - after super
 * // - emit created { ... }
 */
export function EventRepository(): ClassDecorator {
  return target => {
    decorate(target, 'create', Emit('created'));
    decorate(target, 'update', Emit('updated'));
    decorate(target, 'updateOne', Emit('updated'));
    decorate(target, 'delete', Emit('deleted'));
    decorate(target, 'deleteOne', Emit('deleted'));
    decorate(target, 'upsertRaw', Emit(result => result.operation, result => result.result));

    decorate(target, 'createMany', Wrap(originalMethod => async function (this, ...args) {
      if (skipEmit(args)) {
        return originalMethod.apply(this, args);
      }

      const created = await originalMethod.apply(this, args);
      for (const doc of created) {
        this.emit('created', doc);
      }
      return created;
    }));

    decorate(target, 'updateMany', Wrap(originalMethod => async function (this, filter, update, ...args) {
      if (skipEmit(args)) {
        return originalMethod.call(this, filter, update, ...args);
      }

      const result = await originalMethod.call(this, filter, update, ...args);
      const postMatching = await this.findAll(filter, ...args);
      for (const updated of postMatching) {
        this.emit('updated', updated);
      }
      return result;
    }));

    decorate(target, 'deleteMany', Wrap(originalMethod => async function (this, ...args) {
      if (skipEmit(args)) {
        return originalMethod.apply(this, args);
      }

      const preMatching = await this.findAll(...args);
      const result = await originalMethod.apply(this, args);
      for (const deleted of preMatching) {
        this.emit('deleted', deleted);
      }
      return result;
    }));

    decorate(target, 'save', Wrap(originalMethod => async function (this, doc: Document, ...args) {
      if (skipEmit(args)) {
        return originalMethod.call(this, doc, ...args);
      }

      const event = doc.isNew ? 'created' : doc.isModified() ? 'updated' : null;
      const result = await originalMethod.call(this, doc, ...args);
      if (event) {
        this.emit(event, doc);
      }
      return result;
    }));

    decorate(target, 'saveAll', Wrap(originalMethod => async function (this, docs: Document[], ...args) {
      if (skipEmit(args)) {
        return originalMethod.call(this, docs, ...args);
      }

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
    }));

    decorate(target, 'deleteAll', Wrap(originalMethod => async function (this, docs: Document[], ...args) {
      const result = await originalMethod.call(this, docs, ...args);
      if (!skipEmit(args)) {
        for (const doc of docs) {
          this.emit('deleted', doc);
        }
      }
      return result;
    }));
  }
}

export function Emit(event: string | ((result: any) => string), extractor?: (result: any) => any): MethodDecorator {
  return Wrap(originalMethod => async function (this, ...args) {
    const result = await originalMethod.apply(this, args);
    if (result && !skipEmit(args)) {
      this.emit(typeof event === 'string' ? event : event(result), extractor ? extractor(result) : result);
    }
    return result;
  });
}

function Wrap(impl: (originalMethod: Function) => (...args: any[]) => any): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    descriptor.value = impl(descriptor.value);
  };
}

function skipEmit(args: any[]): boolean {
  // assume options are the last argument
  return args.length > 0 && args.at(-1)?.emit === false;
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
