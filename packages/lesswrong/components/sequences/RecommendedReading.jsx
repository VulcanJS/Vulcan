import { Components, registerComponent, withDocument} from 'meteor/vulcan:core';
import Sequences from '../../lib/collections/sequences/collection.js';
import { withRouter, Link } from 'react-router';
import React from 'react';

const RecommendedReading = ({sequence, chapter, post, previousPost, nextPost, nextTitle, nextLink, collectionTitle}) => {
  return <Components.Section title="Next Posts" titleComponent={<div className="sequences-navigation-title-subtitle">in <Link to={collectionTitle ? "/sequences" : "/sequences/"+sequence._id} className="sequences-navigation-sequence-name">{collectionTitle || (sequence && sequence.title) || ""}</Link></div>}>
    <div className="sequences-navigation-bottom-content">
      {previousPost ? <div className="sequences-navigation-bottom-previous-post">
        <Components.PostsItem post={previousPost} inlineCommentCount={true} chapter={chapter}/>
      </div> : null}
      <div className="sequences-navigation-bottom-divider"></div>
      {nextTitle ? <div className="sequences-navigation-bottom-next-post next-only"><Link className="sequences-navigation-next-post" to={post.nextPageLink}>Next: {post.nextPageTitle}</Link></div> : (nextPost ? <div className="sequences-navigation-bottom-next-post">
        <Components.PostsItem post={nextPost} inlineCommentCount={true} chapter={chapter} />
      </div> : null) }
    </div>
  </Components.Section>
};


registerComponent('RecommendedReading', RecommendedReading,  withRouter);
