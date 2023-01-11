import { NotFoundException } from "@nestjs/common";

export function notFound(msg: unknown): never {
  throw new NotFoundException(msg);
}
