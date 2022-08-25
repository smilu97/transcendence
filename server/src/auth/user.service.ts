import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UuidService } from 'src/database/snowflake.service';

import { User } from './entity/user.entity';
import { UserDetail } from './entity/userDetail.entity';

@Injectable()
export class UserService {
    constructor(
        private uuidService: UuidService,
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        @Inject('USER_REPOSITORY') private userRepo: Repository<User>,
        @Inject('USER_DETAIL_REPOSITORY') private userDetailRepo: Repository<UserDetail>,
    ) {}

    async getById(id: number): Promise<User> {
        return await this.userRepo.findOneBy({ id });
    }

    async getByUserName(username: string): Promise<User> {
        return await this.userRepo.findOneBy({ username });
    }

    async create(username: string, password: string): Promise<boolean> {
        if (await this.userRepo.findOneBy({ username })) {
            return false;
        }

        await this.dataSource.manager.transaction('READ COMMITTED', async em => {
            const detail = new UserDetail();
            detail.id = this.uuidService.id();
            await em.save(detail);

            const user = new User();
            user.id = this.uuidService.id();
            user.username = username;
            user.password = password;
            user.detail = detail;
            await em.save(user);
        });

        return true;
    }
}
