import { Service, CommonServiceOptions } from '../common/service';
import { UserDao } from './user.dao';
import { User } from './user.dto';

export interface UserState {
  profile?: User;
}

const initialState: UserState = {};

export default class UserService extends Service<UserState> {
  constructor(cso: CommonServiceOptions, private userDao: UserDao) {
    super('user', initialState, cso);
  }

  async updateProfile(): Promise<void> {
    const auth = this.getHttpAuthRequired();
    this.state.profile = await this.userDao.getProfile(auth);
  }

  getProfile() {
    return this.getSnapshot().profile;
  }
}
