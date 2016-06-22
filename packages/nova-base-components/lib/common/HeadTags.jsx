import React, { PropTypes, Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

class HeadTags extends Component {
	render() {
		DocHead.removeDocHeadAddedTags();

		const url = this.props.url ? this.props.url : Telescope.utils.getSiteUrl();
		const title = this.props.title ? this.props.title : Telescope.settings.get("title", "Nova");
		const description = this.props.description ? this.props.description : Telescope.settings.get("tagline");

		let image = Telescope.utils.getSiteUrl() + Telescope.settings.get("logoUrl");
		if (!!this.props && !!this.props.image) {
			image = this.props.image;
		} else if (!!Telescope.settings.get("siteImage")) {
			image = Telescope.settings.get("siteImage");
		}

		const metas = [
			{ charset: "utf-8" },
			{ name: "description", content: description },
			// responsive
			{ name: "viewport", content:"width=device-width, initial-scale=1" },
			// facebook
			{ property: "og:type", content: "article" },
			{ property: "og:url", content: url },
			{ property: "og:image", content: image },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			//twitter
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:image:src", content: image },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description }
		];

		const links = [
			{ rel: "canonical", href: Telescope.utils.getSiteUrl() },
			{ rel: "shortcut icon", href: Telescope.settings.get("favicon", "/img/favicon.ico") }
		];

		return (
			<div>
				{ DocHead.setTitle(title) }
				{ metas.map(meta => DocHead.addMeta(meta)) }
				{ links.map(link => DocHead.addLink(link)) }
			</div>
		);
	}
}

HeadTags.propTypes = {
	url: React.PropTypes.string,
	title: React.PropTypes.string,
	description: React.PropTypes.string,
	image: React.PropTypes.string,
};

module.exports = HeadTags;
export default HeadTags;
