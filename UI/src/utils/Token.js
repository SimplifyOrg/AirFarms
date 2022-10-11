import { useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

const initToken = '';
let currentToken = initToken;
let globalSetSecret = () => { throw new Error(`you must useAccessToken before setting its state`); };

export const useAccessToken = singletonHook(initToken, () => {
  const [secret, setSecret] = useState(initToken);
  globalSetSecret = setSecret;
  currentToken = secret;
  return secret;
});

export const setAccessToken = secret => globalSetSecret(secret);
export const getAccessToken = () => currentToken;