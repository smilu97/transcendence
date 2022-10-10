import { DaoError } from '../common/error';

export class GetProfileError extends DaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'GetProfileError';
  }
}
