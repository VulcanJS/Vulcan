import Telescope from 'meteor/nova:lib';
import { getSetting } from 'meteor/nova:core';

Telescope.headtags.link.push({
  rel: "alternate", 
  type: "application/rss+xml",
  href: `${getSetting("siteUrl")}feed.xml`
});