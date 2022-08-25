import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from 'src/database/database.module';

import { AuthController } from './auth.controller';
import { authRepositories } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from './user.service';

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default',
            signOptions: { expiresIn: '120d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtStrategy, ...authRepositories],
    exports: [...authRepositories, AuthService],
})
export class AuthModule {}
