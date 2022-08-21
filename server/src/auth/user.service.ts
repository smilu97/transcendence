import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/database/auth/user.entity';
import { UserDetail } from 'src/database/auth/user_detail.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        @Inject('USER_REPOSITORY') private userRepo: Repository<User>,
        @Inject('USER_DETAIL_REPOSITORY') private userDetailRepo: Repository<UserDetail>,
    ) {}

    async getById(id: string): Promise<User> {
        return await this.userRepo.findOneBy({ id });
    }

    async getByUserName(username: string): Promise<User> {
        return await this.userRepo.findOneBy({ username });
    }

    async create(username: string, password: string): Promise<boolean> {
        if (await this.userRepo.findOneBy({ username })) {
            return false;
        }

        await this.dataSource.manager.transaction(async em => {
            const detail = new UserDetail();
            await em.save(detail);

            const user = new User();
            user.username = username;
            user.password = password;
            user.detail = detail;
            await em.save(user);
        });

        return true;
    }
}
