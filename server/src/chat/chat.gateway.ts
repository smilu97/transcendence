import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "dgram";
import { AuthService } from "src/auth/auth.service";
import { ChatService } from "./chat.service";

@WebSocketGateway(3001, {
    cors: { origin: '*' },
})
export class ChatGateway {
    constructor(
        private chatService: ChatService,
        private authService: AuthService,
    ) {}

    @SubscribeMessage('echo')
    echo(@MessageBody() msg: string): string {
        return msg;
    }

    @SubscribeMessage('hello')
    hello(): string {
        return 'hello';
    }

    @SubscribeMessage('health')
    async updateHealth(
        @ConnectedSocket() socket: Socket,
        @MessageBody('content') content: string,
        @MessageBody('token') token: string,
    ) {
        const { id: userId } = this.authService.verify(token);
        await this.chatService.updateHealth(socket, userId, content);
    }
}
