import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { UuidService } from './snowflake.service';

@Module({
    providers: [...databaseProviders, UuidService],
    exports: [...databaseProviders, UuidService],
})
export class DatabaseModule {}
