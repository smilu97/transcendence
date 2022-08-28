import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { chatRepositories } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [DatabaseModule, AuthModule, LoggerModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ...chatRepositories],
  exports: [...chatRepositories],
})
export class ChatModule {}
