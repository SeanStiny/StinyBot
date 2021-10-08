import axios from 'axios';
import { config } from '../config';

/**
 * Authenticate the app to use the Twitch API.
 */
export async function appToken(): Promise<string> {
  if (appAuth.expires === undefined || Date.now() > appAuth.expires) {
    await generateAppToken();
  }

  // If something went wrong.
  if (appAuth.accessToken === undefined) {
    throw 'appAuth.accessToken is undefined';
  }
  return appAuth.accessToken;
}

/**
 * App authentication data.
 */
let appAuth: {
  accessToken?: string;
  expires?: number;
} = {};

/**
 * Auth token response data.
 */
interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string[];
  token_type: 'bearer';
}

/**
 * Generate a new app access token.
 */
async function generateAppToken(): Promise<void> {
  const now = Date.now();
  const response = await axios.post<TokenData>(
    'https://id.twitch.tv/oauth2/token' +
      `?client_id=${config.clientId}` +
      `&client_secret=${config.clientSecret}` +
      `&grant_type=client_credentials`
  );
  appAuth = {
    accessToken: response.data.access_token,
    expires: now + response.data.expires_in * 1000,
  };
}
