import { ApiProperty } from '@nestjs/swagger';

export class BasicLoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
