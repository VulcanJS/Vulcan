import { registerComponent } from 'meteor/nova:lib';
import React from 'react';
import { FormattedMessage } from "react-intl";

const PostsNoResults = props => <p className="posts-no-results"><FormattedMessage id="posts.no_results"/></p>;

PostsNoResults.displayName = "PostsNoResults";

registerComponent('PostsNoResults', PostsNoResults);
