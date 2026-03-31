import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(_err: Error, user: T, _info: Error) {
    if (user) {
      return user;
    }
    return null;
  }
}
