import Helmet from 'react-helmet';

const HeadTags = () => {

	const	logoUrl = Telescope.get("logoUrl", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/SN1994D.jpg/800px-SN1994D.jpg"); // supernova picture
	const siteTitle = Telescope.get("title", "Telescope");
	const	tagline = Telescope.get("tagline");
	const favicon = Telescope.get("favicon", "/img/favicon.ico");

	return (
		<Helmet
			title={siteTitle}
			base={{href: Meteor.absoluteUrl()}}
			meta={[
				{charset: "utf-8"},
				{name: "description", content: tagline},
				// facebook
				{property: "og:type", content: "article"},
				{property: "og:url", content: Telescope.utils.getSiteUrl()},
				{property: "og:image", content: logoUrl},
				{property: "og:title", content: siteTitle},
				{property: "og:description", content: tagline},
				//twitter
				{name: "twitter:card", content: "summary"},
				{name: "twitter:image:src", content: logoUrl},
				{name: "twitter:title", content: siteTitle},
				{name: "twitter:description", content: tagline}
			]}
			link={[
				{rel: "canonical", href: Telescope.utils.getSiteUrl()},
				{rel: "shortcut icon", href: favicon}
			]}
		/>
	);
	
};

module.exports = HeadTags;