import { Headtags, Utils } from 'meteor/nova:core';

// add permanent <link /> markup
Headtags.link.push({
  rel: "alternate", 
  type: "application/rss+xml",
  href: `${Utils.getSiteUrl()}feed.xml`
});
