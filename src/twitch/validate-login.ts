/**
 * Check if a string contains a valid Twitch login name.
 */
export function isValidLogin(login: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9_]{3,24}$/.test(login);
}
