import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
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
    providers: [UserService, JwtStrategy],
})
export class AuthModule {}
