import { Redirect, withRouter } from 'react-router'
import { Components, registerComponent, withList } from 'meteor/vulcan:core'
import Posts from 'meteor/vulcan:posts'
import React from 'react'

const LegacyPostWrapper = (props) => {
  if (!props.loading && props.results) {
    if(props.params.commentId) {
      props.router.push({pathname: Posts.getPageUrl(props.results[0]) + "#" + props.params.commentId, query: {legacy: true}});
    } else {
      props.router.push(Posts.getPageUrl(props.results[0]));
    }
    return (<div className="legacy-wrapper">
      <Components.Loading />
    </div>)
  } else {
    return (<div className="legacy-wrapper">
      <Components.Loading />
    </div>)
  }


}

const options = {
  collection: Posts,
  fragmentName: 'PostUrl',
  limit: 1,
  totalResolver: false,
}


registerComponent("LegacyPostWrapper", LegacyPostWrapper, withRouter, [withList, options]);
