import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BasicLoginDto } from './dto/basicLogin.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class UserProfile {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/login/basic')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Successful login' })
  async login(@Body() body: BasicLoginDto): Promise<string> {
    const { username, password } = body;

    const user = await this.userService.getByUserName(username);
    if (!user || user.password !== password) return '';
    return this.jwtService.sign({ sub: user.id, username });
  }

  @Post('/signup/basic')
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Created new user' })
  async doSignupBasic(@Body() body: BasicLoginDto): Promise<void> {
    const { username, password } = body;
    await this.userService.create(username, password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: UserProfile })
  getProfile(@Request() req): UserProfile {
    return req.user;
  }
}
