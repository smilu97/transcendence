import { Service, CommonServiceOptions } from '../common/service';
import UserDao from './user.dao';
import { User } from './user.vo';

export interface UserState {
  profile?: User;
}

const initialState: UserState = {};

export default class UserService extends Service<UserState> {
  constructor(cso: CommonServiceOptions, private userDao: UserDao) {
    super('user', initialState, cso);
  }

  async updateProfile(): Promise<void> {
    this.state.profile = await this.userDao.getProfile();
  }

  getProfile() {
    return this.getSnapshot().profile;
  }
}
