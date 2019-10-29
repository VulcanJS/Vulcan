import sanitizeHtml from 'sanitize-html';
import { Utils } from '../modules';
import { throwError } from './errors.js';

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

Utils.performCheck = (operation, user, checkedObject, context, documentId, operationName, collectionName) => {

  if (!operation) {
    throwError({ id: 'app.no_permissions_defined', data: { documentId, operationName } });
  }

  if (!checkedObject) {
    throwError({ id: 'app.document_not_found', data: { documentId, operationName } });
  }

  if (!operation(user, checkedObject, context)) { //Bug fix - removed redundant null check for operation
    throwError({ id: 'app.operation_not_allowed', data: { documentId, operationName } });
  }

};

export { Utils };
