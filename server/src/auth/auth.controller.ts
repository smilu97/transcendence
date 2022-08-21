import * as jwt from 'jsonwebtoken';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { BasicLoginDto } from './dto/basic-login.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    @Post('/login/basic')
    async login(@Body() body: BasicLoginDto): Promise<string> {
        const { username, password } = body;
        const user = await this.userService.getByUserName(username);
        if (!user || user.password !== password)
            return '';
        return this.jwtService.sign({ sub: user.id, username });
    }

    @Post('/signup/basic')
    async doSignupBasic(@Body() body: BasicLoginDto): Promise<void> {
        const { username, password } = body;
        await this.userService.create(username, password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
    
}
