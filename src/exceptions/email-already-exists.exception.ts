import { ConflictException } from '@nestjs/common';

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`The email ${email} is already in use`);
  }
}
