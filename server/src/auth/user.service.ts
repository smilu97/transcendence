import { Injectable } from '@nestjs/common';
import { User } from 'src/database/auth/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
    constructor(private dataSource: DataSource) {}

    async getById(id: string): Promise<User> {
        const userRepo = this.dataSource.getRepository(User);
        return await userRepo.findOneBy({ id });
    }

    async getByUserName(username: string): Promise<User> {
        const userRepo = this.dataSource.getRepository(User);
        return await userRepo.findOneBy({ username });
    }

    async create(username: string, password: string): Promise<boolean> {
        const userRepo = this.dataSource.getRepository(User);

        if (await userRepo.findOneBy({ username })) {
            return false;
        }

        await userRepo.create({ username, password });
        return true;
    }
}
