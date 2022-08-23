import { Module } from '@nestjs/common';
import { authProviders } from './auth/auth.providers';
import { databaseProviders } from './database.providers';
import { UuidService } from './snowflake.service';

@Module({
    providers: [...databaseProviders, ...authProviders, UuidService],
    exports: [...databaseProviders, ...authProviders, UuidService],
})
export class DatabaseModule {}
