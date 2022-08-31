import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '~/stitches.config';
import { usePong } from '../client';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const pong = usePong();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const el = e.currentTarget;

    try {
      const data = new FormData(el);

      const type = data.get('type');
      if (!isString(type)) return;
      const username = data.get('username');
      if (!isString(username)) return;
      const password = data.get('password');
      if (!isString(password)) return;

      if (type === 'login') {
        await pong.auth.loginWithBasic(username, password);
        navigate('/home');
        return;
      }

      if (type === 'register') {
        await pong.auth.register({ username, password });
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      el.reset();
    }
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const el = hiddenInputRef.current;
    if (el === null) return;

    const type = e.currentTarget.dataset['type'];
    if (type === undefined) return;
    el.value = type;

    submitRef.current?.click();
  };

  const submitRef = React.useRef<HTMLButtonElement | null>(null);
  const hiddenInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Box>
      <Form onSubmit={handleSubmit}>
        <TitleBox>
          <Title
            css={{
              WebkitBackgroundClip: 'text',
              WebkitTextStroke: '1px rgba(201, 150, 204, 0.08)',
            }}
          >
            Login
          </Title>
        </TitleBox>
        <InputBox>
          <Input
            name={'username'}
            placeholder={'USERNAME'}
            spellCheck={false}
          />
          <Input
            name={'password'}
            placeholder={'PASSWORD'}
            spellCheck={false}
          />
          <button type={'submit'} ref={submitRef} style={{ display: 'none' }} />
          <input
            type={'hidden'}
            name={'type'}
            value={''}
            ref={hiddenInputRef}
          />
          <LoginButton data-type={'login'} onClick={handleClick}>
            login
          </LoginButton>
          <RegisterButton data-type={'register'} onClick={handleClick}>
            register
          </RegisterButton>
        </InputBox>
      </Form>
    </Box>
  );
};

export default LoginPage;

const isString = (str: unknown): str is string => {
  if (typeof str === 'string') return true;
  return false;
};

const Box = styled('div', {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(120deg, $c1hsl, $c3hsl)',
});

const TitleBox = styled('div', {
  margin: 'auto',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled('h1', {
  fontSize: '2.5rem',
  textAlign: 'center',
  backgroundClip: 'text',
  color: 'transparent',
  background: 'linear-gradient(240deg, $c4hsl 40%, $c3hsl 60%)',
  textTransform: 'uppercase',
});

const Form = styled('form', {
  width: 320,
  height: 540,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid rgba(235, 235, 235, 0.08)',
  borderRadius: 16,
  background: 'rgba(235, 235, 235, 0.12)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0px 3px 4px rgba(235, 235, 235, 0.16)',
});

const InputBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  flex: 1,
  width: '100%',
});

const Input = styled('input', {
  padding: '4px 8px',
  width: '100%',
  background: 'transparent',
  border: '2px solid $c2hsl',
  boxShadow: '-4px 2px 4px $c2hsl',
  borderRadius: 12,
  height: 48,
  outline: 'none',
  color: '$c1hsl',
  fontSize: '1rem',
  fontWeight: 700,
  '&::placeholder': {
    color: '$c1hsl',
  },
});

const ButtonBase = styled('button', {
  width: '100%',
  height: 48,
  borderRadius: 12,
  border: 'none',
  outline: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'uppercase',
});

const LoginButton = styled(ButtonBase, {
  background: 'rgba(235, 235, 235, 0.12)',
  border: '1px solid rgba(235, 235, 235, 0.08)',
  backdropFilter: 'blur(4px)',
  color: '$c2',
});

const RegisterButton = styled(ButtonBase, {
  background: 'rgba(235, 235, 235, 0.12)',
  border: '1px solid rgba(235, 235, 235, 0.08)',
  backdropFilter: 'blur(4px)',
  color: '$c2',
});
