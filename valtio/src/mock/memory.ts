import { HttpAuth } from '../auth';
import { ChatChannel, ChatMessage } from '../chat/chat.dto';
import { GetMessageError, SendMessageError } from '../chat/chat.error';
import { User } from '../user/user.dto';

export interface MemoryUser {
  id: number;
  username: string;
  password: string;
}

export class MemoryPongServer {
  private readonly users: MemoryUser[] = [];
  private readonly channels: ChatChannel[] = [
    {
      id: 1,
      name: 'FakeRoom001',
      type: 'PUBLIC',
    },
    {
      id: 2,
      name: 'FakeRoom002',
      type: 'PUBLIC',
    },
    {
      id: 3,
      name: 'FakeRoom003',
      type: 'PRIVATE',
    },
  ];
  private readonly joinedChannels: number[] = [];
  private readonly messages: { [id: number]: ChatMessage[] } = {
    1: [
      {
        id: 1234,
        content: 'Hello! This message actually does not exist',
        createdAt: Math.floor(Date.now() / 1000),
        authorId: 4444,
        channelId: 1,
      },
    ],
    2: [],
    3: [],
  };
  private newMessageHandlers: ((message: ChatMessage) => void)[] = [];

  onNewMessage(listener: (message: ChatMessage) => void) {
    this.newMessageHandlers.push(listener);
  }

  getTokenByBasicAuth(username: string, password: string): string {
    const user = this.users.find((el) => el.username === username);
    if (!user) {
      throw new Error('not found');
    }
    if (user.password !== password) {
      throw new Error('password error');
    }
    return user.id.toString();
  }

  register(username: string, password: string): void {
    if (this.users.findIndex((el) => el.username === username) >= 0) {
      throw new Error('username duplicated');
    }

    const id = Math.floor(Math.random() * 10000);
    this.users.push({ id, username, password });
  }

  getChannels(): ChatChannel[] {
    return [...this.channels];
  }

  getJoinedChannels(): ChatChannel[] {
    return this.channels.filter(
      (el) => this.joinedChannels.indexOf(el.id) !== -1,
    );
  }

  createChannel(
    auth: HttpAuth,
    name: string,
    password?: string | undefined,
  ): void {
    let id = Math.floor(Math.random() * 10000);
    while (this.channels.map((el) => el.id).indexOf(id) !== -1) {
      id = Math.floor(Math.random() * 10000);
    }

    this.channels.push({
      id,
      name,
      type: password ? 'PRIVATE' : 'PUBLIC',
    });
    this.joinedChannels.push(id);
    this.messages[id] = [];
  }

  joinChannel(
    auth: HttpAuth,
    channelId: number,
    password?: string | undefined,
  ): void {
    this.joinedChannels.push(channelId);
  }

  leaveChannel(auth: HttpAuth, channelId: number): void {
    const index = this.joinedChannels.indexOf(channelId);
    if (index >= 0) {
      this.joinedChannels.splice(index, 1);
      delete this.messages[channelId];
    }
  }

  sendMessage(auth: HttpAuth, channelId: number, content: string): void {
    if (this.joinedChannels.indexOf(channelId) < 0) {
      throw new SendMessageError('unauthorized');
    }

    const message: ChatMessage = {
      id: Math.floor(Math.random() * 100000),
      content,
      createdAt: Date.now(),
      authorId: Math.floor(Math.random() * 10000),
      channelId,
    };

    this.messages[channelId].push(message);
    this.newMessageHandlers.forEach((handler) => handler(message));
  }

  getMessages(auth: HttpAuth, channelId: number): ChatMessage[] {
    if (this.joinedChannels.indexOf(channelId) < 0) {
      throw new GetMessageError('unauthorized');
    }

    return [...this.messages[channelId]];
  }

  getProfile(auth: HttpAuth): User {
    const userId = this.decodeAuth(auth);
    const user = this.users.find((el) => el.id === userId);
    if (!user) {
      throw new Error('not found');
    }
    return {
      id: userId,
      username: user.username,
    };
  }

  private decodeAuth(auth: HttpAuth): number {
    if (auth.type !== 'bearer') {
      throw new Error('Only bearer auth is providen');
    }
    const { token } = auth;
    return Number.parseInt(token);
  }
}
