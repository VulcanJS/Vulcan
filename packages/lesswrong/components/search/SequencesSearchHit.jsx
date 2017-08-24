import { Components, registerComponent} from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import moment from 'moment';
import { Link } from 'react-router';
import { InstantSearch, Hits, SearchBox, Highlight, RefinementList, Pagination, CurrentRefinements, ClearAll, Snippet} from 'react-instantsearch/dom';
import CommentIcon from 'material-ui/svg-icons/editor/mode-comment';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';

import React, { PureComponent } from 'react';

const SequencesSearchHit = ({hit, clickAction}) => {
  const linkProperties = clickAction ? {onTouchTap: () => clickAction(hit._id)} : {to: "sequences/" + hit._id};
  return <div className="search-results-sequences-item sequences-item">
      <Link {...linkProperties} className="sequence-item-title-link">
        <div className="sequences-item-body ">
          <div className="sequences-item-title">
            {hit.title}
          </div>
          <div className="sequences-item-meta">
            <div className="sequences-item-author">{hit.authorDisplayName}</div>
            <div className="sequences-item-karma">{hit.karma} points </div>
            <div className="sequences-item-created-date"> {moment(new Date(hit.createdAt)).fromNow()}</div>
          </div>
        </div>
      </Link>
  </div>
}

registerComponent("SequencesSearchHit", SequencesSearchHit);
