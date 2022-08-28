import { HttpWsDao } from '../common/dao';
import { HttpStatus } from '../common/http-status';
import { BasicLoginError, BasicRegisterError } from './auth.error';

export interface RegisterParams {
  username: string;
  password: string;
}

export default class AuthDao extends HttpWsDao {
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

  pulse() {
    this.ws.pulse();
  }
}
