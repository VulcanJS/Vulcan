/* eslint-disable */

// Original can be found here: https://github.com/Ranks/emojione
const convertShortNameToUnicode = function(unicode) {
  if (unicode.indexOf("-") > -1) {
    var parts = [];
    var s = unicode.split('-');
    for(var i = 0; i < s.length; i++) {
      var part = parseInt(s[i], 16);
      if (part >= 0x10000 && part <= 0x10FFFF) {
        var hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
        var lo = ((part - 0x10000) % 0x400) + 0xDC00;
        part = (String.fromCharCode(hi) + String.fromCharCode(lo));
      }
      else {
        part = String.fromCharCode(part);
      }

      parts.push(part);
    }

    return parts.join('');
  } else {
    var s = parseInt(unicode, 16);
    if (s >= 0x10000 && s <= 0x10FFFF) {
      var hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
      var lo = ((s - 0x10000) % 0x400) + 0xDC00;
      return (String.fromCharCode(hi) + String.fromCharCode(lo));
    } else {
      return String.fromCharCode(s);
    }
  }
};

export default convertShortNameToUnicode;
