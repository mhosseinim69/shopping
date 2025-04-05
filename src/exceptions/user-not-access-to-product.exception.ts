import { ForbiddenException } from '@nestjs/common';

export class UserNotAccessToProductException extends ForbiddenException {
  constructor(userID: number) {
    super(`User with userID ${userID} not access to this product`);
  }
}
