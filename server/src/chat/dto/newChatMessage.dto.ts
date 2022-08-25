import { ApiProperty } from "@nestjs/swagger";

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
