import crypto from 'crypto';

export function generateSecureNumber(length: number) {
  //Safe integer
  if (length < 0) length = 1;
  if (length > 14) length = 14;
  let numString = '1';
  for (let i = 0; i < length; ++i) {
    numString += '0';
  }
  return crypto.randomInt(0, Number(numString));
}
