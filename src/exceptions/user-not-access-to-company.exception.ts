import { ForbiddenException } from '@nestjs/common';

export class UserNotAccessToCompanyException extends ForbiddenException {
  constructor(userID: number) {
    super(`User with userID ${userID} not access to this company`);
  }
}
