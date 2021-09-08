import md5 from 'crypto-js/md5';
/**
 * `hash` takes an input and run it through `CryptoJS.MD5`
 * @see https://atmospherejs.com/jparker/crypto-md5
 * @param  {String} string input string
 * @return {String}        md5 hash of the input
 */
export const hash = function(string) {
  // eslint-disable-next-line babel/new-cap
  return md5(cleanString(string)).toString();
};
/**
 * `cleantString` remove starting and trailing whitespaces
 * and lowercase the input
 * @param  {String} string input string that may contain leading and trailing
 * whitespaces and uppercase letters
 * @return {String}        output cleaned string
 */
export const cleanString = function(string) {
  return string.trim().toLowerCase();
};

/**
 * `isHash` check if a string match the MD5 form :
 * 32 chars string containing letters from `a` to `f`
 * and digits from `0` to `9`
 * @param  {String}  string that might be a hash
 * @return {Boolean}
 */
export const isHash = function(string) {
  return /^[a-f0-9]{32}$/i.test(cleanString(string));
};
