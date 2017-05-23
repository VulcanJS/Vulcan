/*

Embed.providerName.getData should return an object
with the following properties:

- title
- description
- thumbnailUrl
- sourceName
- sourceUrl
- media (object)

*/

import Embed from '../../modules/embed.js';
// import Metascraper from 'metascraper';

Embed.builtin = {

  getData(url) {

    // const metadata = await Metascraper.scrapeUrl(url);

    const metadata = extractMeta(url);
    
    return {
      title: metadata.title,
      description: metadata.description,
      thumbnailUrl: metadata.image,
    }
  }

}

// -------------- //
// adapted from https://github.com/acemtp/meteor-meta-extractor/blob/master/meta-extractor.js

import he from 'he';

const extractMeta = function (params) {
  var html;
  var match;
  var META = {};

  if (params.substr(0, 4) === 'http') {
    try {
      var result = HTTP.call('GET', params);
      if (result.statusCode !== 200) {
        return META;
      }
      html = result.content;
    } catch (e) {
      console.log('catch error', e);
      return META;
    }
  } else {
    html = params;
  }


  // search for a <title>
  var title_regex = /<title>(.*)<\/title>/gmi;

  while ((match = title_regex.exec(html)) !== null) {
    if (match.index === title_regex.lastIndex) {
      title_regex.lastIndex++;
    }
    META.title = match[1];
  }

  // search and parse all <meta>
  var meta_tag_regex = /<meta.*?(?:name|property|http-equiv)=['"]([^'"]*?)['"][\w\W]*?content=['"]([^'"]*?)['"].*?>/gmi;

  var tags = {
    title: ['title', 'og:title', 'twitter:title'],
    description: ['description', 'og:description', 'twitter:description'],
    image: ['image', 'og:image', 'twitter:image'],
    url: ['url', 'og:url', 'twitter:url']
  };

  while ((match = meta_tag_regex.exec(html)) !== null) {
    if (match.index === meta_tag_regex.lastIndex) {
      meta_tag_regex.lastIndex++;
    }

    for (var item in tags) {
      tags[item].forEach(function(prop) {

        if (match[1] === prop) {

          var property = tags[item][0];
          var content = match[2];

          // Only push content to our 'META' object if 'META' doesn't already
          // contain content for that property.
          if (!META[property]) {
            META[property] = he.decode(content);
          }

        }

      });
    }
  }

  return META;
};

