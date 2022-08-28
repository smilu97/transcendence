import { Service, CommonServiceOptions } from '../common/service';
import AuthDao, { RegisterParams } from './auth.dao';

export interface AuthState {
  token?: string;
}

const initialState = {
  token: localStorage.getItem('token') || undefined,
};

export default class AuthService extends Service<AuthState> {
  constructor(cso: CommonServiceOptions, private authDao: AuthDao) {
    super('auth', initialState, cso);
  }

  /**
   * @throws BasicLoginError
   */
  async loginWithBasic(username: string, password: string): Promise<void> {
    const token = await this.authDao.getTokenByBasicAuth(username, password);
    this.state.token = token;
    localStorage.setItem('token', token);
    this.authDao.pulse();
    await this.root.user.updateProfile();
  }

  logout(): void {
    this.state.token = undefined;
    localStorage.removeItem('token');
  }

  async register(params: RegisterParams): Promise<void> {
    await this.authDao.register(params);
  }

  isLogined(): boolean {
    return this.getSnapshot().token !== undefined;
  }
}
