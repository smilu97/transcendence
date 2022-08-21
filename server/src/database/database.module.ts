import { Module } from '@nestjs/common';
import { authProviders } from './auth/auth.providers';
import { databaseProviders } from './database.providers';

@Module({
    providers: [...databaseProviders, ...authProviders],
    exports: [...databaseProviders, ...authProviders],
})
export class DatabaseModule {}
