import { HttpDao, MemoryDao } from '../common/dao';
import { HttpStatus } from '../common/http-status';
import { GetProfileError } from './user.error';
import { User } from './user.dto';
import { HttpAuth } from '../auth';

export interface UserDao {
  getProfile(auth: HttpAuth): Promise<User>;
}

export class HttpUserDao extends HttpDao implements UserDao {
  async getProfile(auth: HttpAuth): Promise<User> {
    const response = await this.http.get('/auth/profile', { auth });

    if (response.status !== HttpStatus.OK) {
      throw new GetProfileError();
    }

    return await response.json();
  }
}

export class MemoryUserDao extends MemoryDao implements UserDao {
  async getProfile(auth: HttpAuth): Promise<User> {
    return this.server.getProfile(auth);
  }
}
