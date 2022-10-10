import { Service, CommonServiceOptions } from '../common/service';
import { makeBearerAuth } from './auth';
import { RegisterParams, AuthDao } from './auth.dao';

export interface AuthState {}

const initialState = {};

export default class AuthService extends Service<AuthState> {
  constructor(cso: CommonServiceOptions, private authDao: AuthDao) {
    super('auth', initialState, cso);
  }

  /**
   * @throws BasicLoginError
   */
  async loginWithBasic(username: string, password: string): Promise<void> {
    const token = await this.authDao.getTokenByBasicAuth(username, password);
    this.root.shared.auth = makeBearerAuth(token);
    localStorage.setItem('token', token);
    this.authDao.pulse(token);
    await this.root.user.updateProfile();
  }

  logout(): void {
    this.root.shared.auth = undefined;
    localStorage.removeItem('token');
  }

  async register(params: RegisterParams): Promise<void> {
    await this.authDao.register(params);
  }

  isLogined(): boolean {
    return this.getSharedSnapshot().auth !== undefined;
  }
}
