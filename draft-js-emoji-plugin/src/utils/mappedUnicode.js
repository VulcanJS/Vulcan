import emojiList from './emojiList';

const mapUnicode = () => {
  const unicodes = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const shortname in emojiList.list) {
    // eslint-disable-next-line no-continue, no-prototype-builtins
    if (!emojiList.list.hasOwnProperty(shortname)) {
      continue;// eslint-disable-line no-continue
    }

    for (let i = 0, len = emojiList.list[shortname].length; i < len; i += 1) {
      unicodes[emojiList.list[shortname][i]] = shortname;
    }
  }

  return unicodes;
};

export default mapUnicode();
