import { getSetting, Headtags } from 'meteor/nova:core';

Headtags.link.push({
  rel: "alternate", 
  type: "application/rss+xml",
  href: `${getSetting("siteUrl")}feed.xml`
});