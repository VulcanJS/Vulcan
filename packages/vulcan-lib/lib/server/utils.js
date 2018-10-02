import sanitizeHtml from 'sanitize-html';
import { Connectors } from './connectors';
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

Utils.getUnusedSlug = async function (collection, slug) {
  let suffix = '';
  let index = 0;

  const slugRegex = new RegExp('^' + slug + '-[0-9]+$');
  // get all the slugs matching slug or slug-123 in that collection
  const results = await Connectors.find( collection, { slug: { $in: [slug, slugRegex] } }, { fields: { slug: 1, _id: 0 } });
  const usedSlugs = results.map(item => item.slug);
  // increment the index at the end of the slug until we find an unused one
  while (usedSlugs.indexOf(slug + suffix) !== -1) {
    index++;
    suffix = '-' + index;
  }
  return slug + suffix;
};

export { Utils };
