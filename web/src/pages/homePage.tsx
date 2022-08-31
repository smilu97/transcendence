import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthGuard, usePong } from '../client';

export default function HomePage() {
  useAuthGuard();
  const pong = usePong();
  const profile = pong.user.getProfile();

  React.useEffect(() => {
    pong.user.updateProfile().then(() => {});
  }, []);

  const logout = React.useCallback(async () => {
    pong.auth.logout();
  }, []);

  return (
    <div className='bg-black w-screen h-screen'>
      <div className='flex flex-col items-start p-8'>
        <h1 className='text-white'>{JSON.stringify(profile)}</h1>
        <button
          onClick={logout}
          className='bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black'
        >
          Logout
        </button>
        <Link to='/chat'>
          <button className='bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black'>
            Chat
          </button>
        </Link>
      </div>
    </div>
  );
}
