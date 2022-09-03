import { ChangeEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePong } from '../../client';

export default function LoginPage() {
  const navigate = useNavigate();
  const pong = usePong();

  const [username, setUsername] = useState('tester');
  const [password, setPassword] = useState('password');

  const handleUsernameChange = useCallback(
    (el: ChangeEvent<HTMLInputElement>) => {
      setUsername(el.target.value);
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (el: ChangeEvent<HTMLInputElement>) => {
      setPassword(el.target.value);
    },
    [],
  );

  const login = useCallback(async () => {
    await pong.auth.loginWithBasic(username, password);
    navigate('/home');
  }, [username, password]);

  const register = useCallback(async () => {
    await pong.auth.register({ username, password });
  }, [username, password]);

  return (
    <>
      <div className="bg-black w-screen h-screen">
        <div className="flex flex-col items-start p-8">
          <input
            value={username}
            onChange={handleUsernameChange}
            className="my-2"
          />
          <input
            value={password}
            onChange={handlePasswordChange}
            className="my-2"
          />
          <button
            onClick={login}
            className="bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black"
          >
            Login
          </button>
          <button
            onClick={register}
            className="bg-gray-900 text-white text-3xl m-4 p-4 rounded-xl transition-colors hover:bg-teal-300 hover:text-black"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}
