// /!\ will load crypto, too big!
//import cryptoRandomString from 'crypto-random-string';
import { customAlphabet } from 'nanoid';

export const Random = {};
export const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
const nanoid = customAlphabet(UNMISTAKABLE_CHARS);
Random.id = function(length = 17) {
  return nanoid(length);
  //return cryptoRandomString({ length, characters: UNMISTAKABLE_CHARS });
};
