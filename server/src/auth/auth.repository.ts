import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";

import { User } from "./entity/user.entity";
import { UserDetail } from "./entity/userDetail.entity";

export const authRepositories: Provider[] = [
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
