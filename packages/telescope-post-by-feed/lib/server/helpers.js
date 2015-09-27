/*
** Package scoped NPM dependencies and other helper methods
**
*/

/* NPM Dependencies */
toMarkdown = Npm.require('to-markdown').toMarkdown;
he = Npm.require('he');
FeedParser = Npm.require('feedparser');
Readable = Npm.require('stream').Readable;
iconv = Npm.require('iconv-lite');

/* Helper Methods */
getFirstAdminUser = function() {
  return Users.adminUsers({sort: {createdAt: 1}, limit: 1})[0];
};

normalizeEncoding = function(contentBuffer) {
  // got from https://github.com/szwacz/sputnik/
  let encoding;
  let content = contentBuffer.toString();

  let xmlDeclaration = content.match(/^<\?xml .*\?>/);
  if (xmlDeclaration) {
    let encodingDeclaration = xmlDeclaration[0].match(/encoding=("|').*?("|')/);
    if (encodingDeclaration) {
      encoding = encodingDeclaration[0].substring(10, encodingDeclaration[0].length - 1);
    }
  }

  if (encoding && encoding.toLowerCase() !== 'utf-8') {
    try {
      content = iconv.decode(contentBuffer, encoding);
    } catch (err) {
      // detected encoding is not supported, leave it as it is
    }
  }

  return content;
};
