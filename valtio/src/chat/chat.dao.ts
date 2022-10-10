import { HttpAuth } from '../auth';
import { HttpWsDao, MemoryDao, WsDao } from '../common/dao';
import { HttpStatus } from '../common/http-status';
import { ChatChannel, ChatMessage } from './chat.dto';
import {
  CreateChannelError,
  GetChannelsError,
  GetMessageError,
  JoinChannelError,
  LeaveChannelError,
  SendMessageError,
} from './chat.error';

export interface ChatDao {
  getChannels(): Promise<ChatChannel[]>;

  getJoinedChannels(auth: HttpAuth): Promise<ChatChannel[]>;

  createChannel(auth: HttpAuth, name: string, password?: string): Promise<void>;

  joinChannel(
    auth: HttpAuth,
    channelId: number,
    password?: string,
  ): Promise<void>;

  leaveChannel(auth: HttpAuth, channelId: number): Promise<void>;

  sendMessage(
    auth: HttpAuth,
    channelId: number,
    content: string,
  ): Promise<void>;

  getMessages(auth: HttpAuth, channelId: number): Promise<ChatMessage[]>;

  onNewMessage(listener: (message: ChatMessage) => void): void;
}

export class HttpWsChatDao extends HttpWsDao implements ChatDao {
  onNewMessage(listener: (message: ChatMessage) => void): void {
    this.on('newMessages', listener);
  }

  async getChannels(): Promise<ChatChannel[]> {
    const response = await this.http.get('/chat/channels');
    if (response.status !== HttpStatus.OK) {
      throw new GetChannelsError();
    }
    return await response.json();
  }

  async getJoinedChannels(auth: HttpAuth): Promise<ChatChannel[]> {
    const response = await this.http.get('/chat/my/channels', { auth });
    if (response.status !== HttpStatus.OK) {
      throw new GetChannelsError();
    }
    return await response.json();
  }

  async createChannel(
    auth: HttpAuth,
    name: string,
    password = '',
  ): Promise<void> {
    const type = password.length > 0 ? 'PRIVATE' : 'PUBLIC';
    const channel = { name, type, password };
    const response = await this.http.post('/chat/channels', channel, { auth });
    if (response.status !== HttpStatus.CREATED) {
      throw new CreateChannelError();
    }
  }

  async joinChannel(
    auth: HttpAuth,
    channelId: number,
    password = '',
  ): Promise<void> {
    const response = await this.http.post(
      '/chat/join',
      {
        channelId,
        password,
      },
      { auth },
    );
    if (response.status !== HttpStatus.OK) {
      throw new JoinChannelError();
    }
  }

  async leaveChannel(auth: HttpAuth, channelId: number): Promise<void> {
    const response = await this.http.post(
      '/chat/leave',
      { channelId },
      { auth },
    );
    if (response.status !== HttpStatus.OK) {
      throw new LeaveChannelError();
    }
  }

  async sendMessage(
    auth: HttpAuth,
    channelId: number,
    content: string,
  ): Promise<void> {
    const response = await this.http.post(
      `/chat/channels/${channelId}/messages`,
      { content },
      { auth },
    );
    if (response.status !== HttpStatus.CREATED) {
      throw new SendMessageError();
    }
  }

  async getMessages(auth: HttpAuth, channelId: number): Promise<ChatMessage[]> {
    const response = await this.http.get(
      `/chat/channels/${channelId}/messages`,
      { auth },
    );
    if (response.status !== HttpStatus.OK) {
      throw new GetMessageError();
    }
    return await response.json();
  }
}

export class MemoryChatDao extends MemoryDao implements ChatDao {
  onNewMessage(listener: (message: ChatMessage) => void): void {
    this.server.onNewMessage(listener);
  }

  async getChannels(): Promise<ChatChannel[]> {
    return this.server.getChannels();
  }

  async getJoinedChannels(): Promise<ChatChannel[]> {
    return this.server.getJoinedChannels();
  }

  async createChannel(
    auth: HttpAuth,
    name: string,
    password?: string | undefined,
  ): Promise<void> {
    this.server.createChannel(auth, name, password);
  }

  async joinChannel(
    auth: HttpAuth,
    channelId: number,
    password?: string | undefined,
  ): Promise<void> {
    this.server.joinChannel(auth, channelId, password);
  }

  async leaveChannel(auth: HttpAuth, channelId: number): Promise<void> {
    this.server.leaveChannel(auth, channelId);
  }

  async sendMessage(
    auth: HttpAuth,
    channelId: number,
    content: string,
  ): Promise<void> {
    this.server.sendMessage(auth, channelId, content);
  }

  async getMessages(auth: HttpAuth, channelId: number): Promise<ChatMessage[]> {
    return this.server.getMessages(auth, channelId);
  }
}
