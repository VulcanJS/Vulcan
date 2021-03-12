import cryptoRandomString from 'crypto-random-string';


export const Random = {};
export const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';


Random.id = function (length = 17) {
  return cryptoRandomString({ length, characters: UNMISTAKABLE_CHARS });
};
