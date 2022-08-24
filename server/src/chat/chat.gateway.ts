import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway(3001, {
    cors: { origin: '*' },
})
export class ChatGateway {
    @SubscribeMessage('echo')
    echo(@MessageBody() msg: string): string {
        return msg;
    }

    @SubscribeMessage('hello')
    hello(): string {
        return 'hello';
    }
}
