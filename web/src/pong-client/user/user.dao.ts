import { HttpDao } from '../common/dao';
import { HttpStatus } from '../common/http-status';
import { GetProfileError } from './user.error';
import { User } from './user.vo';

export default class UserDao extends HttpDao {
  async getProfile(): Promise<User> {
    const response = await this.http.get('/auth/profile');

    if (response.status !== HttpStatus.OK) {
      throw new GetProfileError();
    }

    return await response.json();
  }
}
