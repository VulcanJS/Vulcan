import { Components, registerComponent} from 'meteor/vulcan:core';
import Posts from 'meteor/vulcan:posts';
import moment from 'moment';
import { Link } from 'react-router';
import { InstantSearch, Hits, SearchBox, Highlight, RefinementList, Pagination, CurrentRefinements, ClearAll, Snippet} from 'react-instantsearch/dom';
import CommentIcon from 'material-ui/svg-icons/editor/mode-comment';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';

import React, { PureComponent } from 'react';

const CommentsSearchHit = ({hit}) => <div className="search-results-comments-item recent-comments-item comments-item">
    <Link to={"/"}>
      <div className="comments-item-body recent-comments-item-body ">
        <object><div className="comments-item-meta recent-comments-item-meta">
          <div className="search-results-comments-item-username">{hit.authorDisplayName}</div>
          <div className="search-results-comments-item-score">{hit.baseScore} points </div>
          <div className="comments-item-date"> {moment(new Date(hit.postedAt)).fromNow()}</div>
          <div className="comments-item-origin">
            {/*on <span className="comments-item-origin-post-title">{hit.post.title}</span>*/}
          </div>
        </div></object>
      <div className="recent-comments-item-text comments-item-text">
        <Snippet attributeName="body" hit={hit} tagName="mark" />
      </div>
      </div>
    </Link>
</div>

registerComponent("CommentsSearchHit", CommentsSearchHit);
