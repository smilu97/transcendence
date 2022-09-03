import { CommonServiceOptions, Service } from '../common/service';
import { ChatDao } from './chat.dao';
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

    this.chatDao.onNewMessage((message: ChatMessage) => {
      this.syncMessages(message.channelId);
    });

    setInterval(() => {
      this.updateChannels().then(() => {});
    }, 10000);
  }

  async updateChannels() {
    this.state.channels = await this.chatDao.getChannels();
    if (this.root.shared.auth) {
      this.state.joinedChannels = await this.chatDao.getJoinedChannels(
        this.getHttpAuthRequired(),
      );
    }
  }

  async createChannel(name: string, password?: string) {
    const auth = this.getHttpAuthRequired();
    await this.chatDao.createChannel(auth, name, password);
    await this.updateChannels();
  }

  selectChannels() {
    return this.getSnapshot().channels;
  }

  async sendMessage(channelId: number, content: string) {
    const auth = this.getHttpAuthRequired();
    await this.chatDao.sendMessage(auth, channelId, content);
  }

  selectMessage(channelId: number) {
    return this.getSnapshot().messages[channelId];
  }

  async joinChannel(channelId: number, password = '') {
    const auth = this.getHttpAuthRequired();
    if (!this.isJoined(channelId)) {
      await this.chatDao.joinChannel(auth, channelId, password);
    }
    this.state.messages[channelId] = await this.chatDao.getMessages(
      auth,
      channelId,
    );
  }

  async syncMessages(channelId: number) {
    const auth = this.getHttpAuthRequired();
    this.state.messages[channelId] = await this.chatDao.getMessages(
      auth,
      channelId,
    );
  }

  private isJoined(channelId: number): boolean {
    return (
      this.state.joinedChannels.filter((e) => e.id === channelId).length > 0
    );
  }
}
