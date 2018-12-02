import sanitizeHtml from 'sanitize-html';
import { Utils } from '../modules';

Utils.sanitize = function(s) {
  return sanitizeHtml(s, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
      'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike',
      'code', 'hr', 'br', 'div', 'table', 'thead', 'caption',
      'tbody', 'tr', 'th', 'td', 'pre', 'img'
    ]
  });
};

export { Utils };
