import {ValidationPipe, ValidationPipeOptions} from '@nestjs/common';

export function ValidatedEvent(pipeOrOptions?: ValidationPipe | ValidationPipeOptions): MethodDecorator {
  const pipe = pipeOrOptions instanceof ValidationPipe ? pipeOrOptions : new ValidationPipe(pipeOrOptions);
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;
    if (!originalMethod.async && Reflect.getMetadata('design:returntype', target, propertyKey) !== Promise) {
      console.warn(`@ValidatedEvent() used on non-async method ${target.constructor.name}.${propertyKey.toString()} - the decorated method will become async`);
    }
    const metatypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < args.length; i++) {
        const metatype = metatypes[i];
        if (metatype && metatype.prototype) {
          args[i] = await pipe.transform(args[i], {type: 'body', metatype});
        }
      }
      return originalMethod.apply(this, args);
    };
  };
}
