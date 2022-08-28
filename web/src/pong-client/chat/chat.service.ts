import { CommonServiceOptions, Service } from '../common/service';
import ChatDao from './chat.dao';
import { ChatChannel, ChatMessage } from './chat.dto';

export interface ChatState {
  channels: ChatChannel[];
  joinedChannels: ChatChannel[];
  messages: { [channelId: number]: ChatMessage[] };
}

const initialState: ChatState = {
  channels: [],
  joinedChannels: [],
  messages: {},
};

export default class ChatService extends Service<ChatState> {
  constructor(cso: CommonServiceOptions, private chatDao: ChatDao) {
    super('auth', initialState, cso);

    this.chatDao.on('newMessage', (message: ChatMessage) => {
      this.syncMessages(message.channelId);
    });

    setInterval(() => {
      this.updateChannels().then(() => {});
    }, 10000);
  }

  async updateChannels() {
    this.state.channels = await this.chatDao.getChannels();
    if (this.root.auth.state.token) {
      this.state.joinedChannels = await this.chatDao.getJoinedChannels();
    }
  }

  async createChannel(name: string, password?: string) {
    await this.chatDao.createChannel(name, password);
    await this.updateChannels();
  }

  selectChannels() {
    return this.getSnapshot().channels;
  }

  async sendMessage(channelId: number, content: string) {
    await this.chatDao.sendMessage(channelId, content);
  }

  selectMessage(channelId: number) {
    return this.getSnapshot().messages[channelId];
  }

  async joinChannel(channelId: number, password = '') {
    if (!this.isJoined(channelId)) {
      await this.chatDao.joinChannel(channelId, password);
    }
    this.state.messages[channelId] = await this.chatDao.getMessages(channelId);
  }

  async syncMessages(channelId: number) {
    this.state.messages[channelId] = await this.chatDao.getMessages(channelId);
  }

  private isJoined(channelId: number): boolean {
    return (
      this.state.joinedChannels.filter((e) => e.id === channelId).length > 0
    );
  }
}
