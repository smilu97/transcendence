import * as jwt from 'jsonwebtoken';
import { Body, Controller, Post } from '@nestjs/common';
import { BasicLoginDto } from './dto/basic-login.dto';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService) {}

    @Post('/login/basic')
    async doLoginBasic(@Body() body: BasicLoginDto): Promise<string> {
        const { username, password } = body;
        const user = await this.userService.getByUserName(username);
        if (!user || user.password !== password) return '';
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET || '');
    }

    @Post('/signup/basic')
    async doSignupBasic(@Body() body: BasicLoginDto): Promise<void> {
        const { username, password } = body;
        await this.userService.create(username, password);
    }
    
}
