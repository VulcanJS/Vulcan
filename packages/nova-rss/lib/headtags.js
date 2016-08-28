import Telescope from 'meteor/nova:lib';

Telescope.headtags.link.push({
  rel: "alternate", 
  type: "application/rss+xml",
  href: `${Telescope.settings.get("siteUrl")}feed.xml`
});