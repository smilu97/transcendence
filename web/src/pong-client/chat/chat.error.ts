import { DaoError } from '../common/error';

export class ChatDaoError extends DaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'ChatDaoError';
  }
}

export class GetChannelsError extends ChatDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'GetChannelsError';
  }
}

export class CreateChannelError extends ChatDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'CreateChannelError';
  }
}

export class JoinChannelError extends ChatDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'JoinChannelError';
  }
}

export class LeaveChannelError extends ChatDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'LeaveChannelError';
  }
}

export class SendMessageError extends ChatDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'SendMessageError';
  }
}

export class GetMessageError extends ChatDaoError {
  constructor(message?: string) {
    super(message);
    this.name = 'GetMessageError';
  }
}
