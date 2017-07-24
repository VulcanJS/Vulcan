import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const PostsNoResults = props => <p className="posts-no-results"><FormattedMessage id="posts.no_results"/></p>;

PostsNoResults.displayName = "PostsNoResults";

registerComponent('PostsNoResults', PostsNoResults);
