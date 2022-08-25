import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { chatRepositories } from "./chat.repository";
import { ChatService } from "./chat.service";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [ChatController],
    providers: [
        ChatGateway,
        ChatService,
        ...chatRepositories
    ],
    exports: [...chatRepositories],
})
export class ChatModule {}
