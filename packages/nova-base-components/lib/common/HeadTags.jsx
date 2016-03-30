import React from 'react';
import Helmet from 'react-helmet';

const HeadTags = ({url, title, description, image}) => {
	return (
		<Helmet
			title={title}
			base={{href: Telescope.utils.getSiteUrl()}}
			meta={[
				{charset: "utf-8"},
				{name: "description", content: description},
				// facebook
				{property: "og:type", content: "article"},
				{property: "og:url", content: url},
				{property: "og:image", content: image},
				{property: "og:title", content: title},
				{property: "og:description", content: description},
				//twitter
				{name: "twitter:card", content: "summary"},
				{name: "twitter:image:src", content: image},
				{name: "twitter:title", content: title},
				{name: "twitter:description", content: description}
			]}
			link={[
				{rel: "canonical", href: Telescope.utils.getSiteUrl()},
				{rel: "shortcut icon", href: Telescope.settings.get("favicon", "/img/favicon.ico")}
			]}
		/>
	);
};

module.exports = HeadTags;