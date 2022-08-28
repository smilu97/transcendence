import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DeepReadonly } from 'ts-essentials';
import { Link } from 'react-router-dom';
import { ChatChannel } from '../../pong-client/chat/chat.dto';
import { useAuthGuard, usePong } from '../../pong-client/react';

export default function ChatPage() {
  useAuthGuard();
  const pong = usePong();

  const [scopedChannelId, setScopedChannelId] = useState(0);
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const [content, setContent] = useState('');

  const messages = pong.chat.selectMessage(scopedChannelId) || [];

  const handleChangeChannelName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setChannelName(e.target.value);
    },
    [],
  );

  const handleChangeChannelPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setChannelPassword(e.target.value);
    },
    [],
  );

  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value);
    },
    [],
  );

  useEffect(() => {
    pong.chat.updateChannels().then(() => {});
  }, []);

  const createChannel = useCallback(async () => {
    await pong.chat.createChannel(channelName, channelPassword);
  }, [channelName, channelPassword]);

  const join = useCallback(
    async (channel: DeepReadonly<ChatChannel>) => {
      await pong.chat.joinChannel(channel.id, channelPassword);
      setScopedChannelId(channel.id);
    },
    [channelPassword],
  );

  const send = useCallback(async () => {
    await pong.chat.sendMessage(scopedChannelId, content);
  }, [scopedChannelId, content]);

  const channels = pong.chat.selectChannels();
  const renderedChannels = useMemo(
    () =>
      channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => join(channel)}
          className="bg-gray-300 w-full mb-2 pl-2 py-1 text-black hover:text-teal-800"
        >
          {channel.name}
        </button>
      )),
    [channels],
  );

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <div key={message.id}>
          <p className="text-white">{message.content}</p>
        </div>
      )),
    [messages],
  );

  return (
    <div className="flex flex-row">
      <div className="flex flex-1/2 flex-col items-start p-8">
        <input
          value={channelName}
          onChange={handleChangeChannelName}
          className="my-2"
        />
        <input
          value={channelPassword}
          onChange={handleChangeChannelPassword}
          className="my-2"
        />
        <button
          onClick={createChannel}
          className="bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black"
        >
          Create Channel
        </button>
        <Link to="/home">
          <button className="bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black">
            Home
          </button>
        </Link>
        <input
          value={content}
          onChange={handleChangeContent}
          className="my-2"
        />
        <button
          onClick={send}
          className="bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black"
        >
          Send
        </button>
        {renderedChannels}
      </div>
      <div className="flex p-12 flex-col">{renderedMessages}</div>
    </div>
  );
}
