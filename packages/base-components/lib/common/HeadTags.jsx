import Helmet from 'react-helmet';

const settings = {
	logoUrl: Telescope.settings.get("logoUrl", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/SN1994D.jpg/800px-SN1994D.jpg"), // supernova picture
	siteTitle: Telescope.settings.get("title", "Telescope"),
	tagline: Telescope.settings.get("tagline", "Telescope, the Nova way"),
	favicon: Telescope.settings.get("favicon", "http://www.telescopeapp.org/images/favicon.ico")
};

const HeadTags = () => (
	<Helmet
		title={settings.siteTitle}
		base={{href: Meteor.absoluteUrl()}}
		meta={[
			{charset: "utf-8"},
			{name: "description", content: settings.tagline},
			// facebook
			{property: "og:type", content: "article"},
			{property: "og:url", content: Meteor.absoluteUrl()},
			{property: "og:image", content: settings.logoUrl},
			{property: "og:title", content: settings.siteTitle},
			{property: "og:description", content: settings.tagline},
			//twitter
			{name: "twitter:card", content: "summary"},
			{name: "twitter:image:src", content: settings.logoUrl},
			{name: "twitter:title", content: settings.siteTitle},
			{name: "twitter:description", content: settings.tagline}
		]}
		link={[
			{rel: "canonical", href: Meteor.absoluteUrl()},
			{rel: "shortcut icon", href: settings.favicon}
		]}
	/>
);

module.exports = HeadTags;