export interface ChatMessage {
  id: number;
  content: string;
  createdAt: number;
  authorId: number;
  channelId: number;
}

export interface ChatChannel {
  id: number;
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: number;
  authorId: number;
}
