export class DaoError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DaoError';
  }
}
