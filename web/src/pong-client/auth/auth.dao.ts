import { HttpWsDao, MemoryDao } from '../common/dao';
import { HttpStatus } from '../common/http-status';
import { BasicLoginError, BasicRegisterError } from './auth.error';

export interface RegisterParams {
  username: string;
  password: string;
}

export interface AuthDao {
  getTokenByBasicAuth(username: string, password: string): Promise<string>;

  register(params: RegisterParams): Promise<void>;

  pulse(token: string): void;
}

export class HttpWsAuthDao extends HttpWsDao implements AuthDao {
  /**
   * @throws BasicLoginError
   */
  async getTokenByBasicAuth(
    username: string,
    password: string,
  ): Promise<string> {
    const response = await this.http.post('/auth/login/basic', {
      username,
      password,
    });

    if (response.status !== HttpStatus.OK) {
      throw new BasicLoginError();
    }

    return await response.text();
  }

  async register(params: RegisterParams): Promise<void> {
    const response = await this.http.post('/auth/signup/basic', params);

    if (response.status !== HttpStatus.CREATED) {
      throw new BasicRegisterError();
    }
  }

  pulse(token: string) {
    this.ws.pulse(token);
  }
}

export class MemoryAuthDao extends MemoryDao implements AuthDao {
  async getTokenByBasicAuth(
    username: string,
    password: string,
  ): Promise<string> {
    return this.server.getTokenByBasicAuth(username, password);
  }

  async register({ username, password }: RegisterParams): Promise<void> {
    this.server.register(username, password);
  }

  pulse(): void {}
}
