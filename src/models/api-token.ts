import { collections } from '../database';

export interface ApiToken {
  token: string;
  channelId: number;
}

export async function findApiToken(token: string): Promise<ApiToken | null> {
  if (!collections.apiTokens) {
    return null;
  }

  return await collections.apiTokens.findOne({ token });
}
