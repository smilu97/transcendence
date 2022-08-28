import { HttpWsDao } from '../common/dao';
import HttpConnector from '../common/http-connector';
import { HttpStatus } from '../common/http-status';
import WsConnector from '../common/ws-connector';
import { ChatChannel, ChatMessage } from './chat.dto';
import {
  CreateChannelError,
  GetChannelsError,
  GetMessageError,
  JoinChannelError,
  LeaveChannelError,
  SendMessageError,
} from './chat.error';

export default class ChatDao extends HttpWsDao {
  async getChannels(): Promise<ChatChannel[]> {
    const response = await this.http.get('/chat/channels');
    if (response.status !== HttpStatus.OK) {
      throw new GetChannelsError();
    }
    return await response.json();
  }

  async getJoinedChannels(): Promise<ChatChannel[]> {
    const response = await this.http.get('/chat/my/channels');
    if (response.status !== HttpStatus.OK) {
      throw new GetChannelsError();
    }
    return await response.json();
  }

  async createChannel(name: string, password = ''): Promise<void> {
    const type = password.length > 0 ? 'PRIVATE' : 'PUBLIC';
    const channel = { name, type, password };
    const response = await this.http.post('/chat/channels', channel);
    if (response.status !== HttpStatus.CREATED) {
      throw new CreateChannelError();
    }
  }

  async joinChannel(channelId: number, password = ''): Promise<void> {
    const response = await this.http.post('/chat/join', {
      channelId,
      password,
    });
    if (response.status !== HttpStatus.OK) {
      throw new JoinChannelError();
    }
  }

  async leaveChannel(channelId: number): Promise<void> {
    const response = await this.http.post('/chat/leave', { channelId });
    if (response.status !== HttpStatus.OK) {
      throw new LeaveChannelError();
    }
  }

  async sendMessage(channelId: number, content: string): Promise<void> {
    const response = await this.http.post(
      `/chat/channels/${channelId}/messages`,
      { content },
    );
    if (response.status !== HttpStatus.CREATED) {
      throw new SendMessageError();
    }
  }

  async getMessages(channelId: number): Promise<ChatMessage[]> {
    const response = await this.http.get(
      `/chat/channels/${channelId}/messages`,
    );
    if (response.status !== HttpStatus.OK) {
      throw new GetMessageError();
    }
    return await response.json();
  }
}
