import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [UserService]
})
export class AuthModule {}
