import { Components, registerComponent} from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import moment from 'moment';
import { Link } from 'react-router';
import { InstantSearch, Hits, SearchBox, Highlight, RefinementList, Pagination, CurrentRefinements, ClearAll, Snippet} from 'react-instantsearch/dom';
import CommentIcon from 'material-ui/svg-icons/editor/mode-comment';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';

import React, { PureComponent } from 'react';

const UsersSearchHit = ({hit}) => <div className="search-results-users-item users-item">
    <Link to={Users.getProfileUrl(hit)}>
      <div className="users-item-body ">
        <div className="users-item-name">
          {hit.displayName}
        </div>
        <div className="users-item-meta">
          <div className="users-item-karma">{hit.karma} points </div>
          <div className="users-item-created-date"> {moment(new Date(hit.createdAt)).fromNow()}</div>
        </div>
      </div>
    </Link>
</div>

registerComponent("UsersSearchHit", UsersSearchHit);
