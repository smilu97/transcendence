import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "./user.entity";
import { UserDetail } from "./user_detail.entity";

export const authProviders: Provider[] = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'USER_DETAIL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserDetail),
        inject: ['DATA_SOURCE'],
    },
];
