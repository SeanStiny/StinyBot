/**
 * Test that a string represents an integer number.
 * @param str The string to test.
 * @returns True if the string contains an integer number, false otherwise.
 */
export function isInteger(str: string): boolean {
  return /^\d+$/.test(str);
}
