import { DaoError } from '../common/error';

export class AuthDaoError extends DaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'AuthDaoError';
  }
}

export class BasicLoginError extends AuthDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'BasicLoginError';
  }
}

export class BasicRegisterError extends AuthDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'BasicRegisterError';
  }
}
