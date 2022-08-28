import { ApiProperty } from '@nestjs/swagger';
import { ChatChannel } from './entity/chatChannel.entity';
import { ChatMessage } from './entity/chatMessage.entity';

export class ContentDto {
  @ApiProperty()
  content: string;
}

export class CreateChannelDto {
  @ApiProperty()
  type: 'PUBLIC' | 'PRIVATE';

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}

export class ChatChannelDto {
  constructor(that: ChatChannelDto) {
    this.id = that.id;
    this.type = that.type;
    this.name = that.name;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  type: 'DIRECT' | 'PUBLIC' | 'PRIVATE';

  @ApiProperty()
  name: string;
}

export class ChannelIdDto {
  @ApiProperty()
  channelId: number;
}

export class ChannelJoinDto {
  @ApiProperty()
  channelId: number;

  @ApiProperty()
  password: string;
}

export class NewChatMessageDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  channelId: number;
}

export class HealthDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  token?: string;
}

export class ChatMessageDto {
  constructor(that: ChatMessageDto) {
    this.id = that.id;
    this.content = that.content;
    this.createdAt = that.createdAt;
    this.authorId = that.authorId;
  }

  @ApiProperty()
  id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  authorId: number;
}
