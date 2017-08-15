import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import { Link } from 'react-router';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { withRouter } from 'react-router'
import Users from 'meteor/vulcan:users';



const viewNames = {
  'postCommentsTop': 'magical algorithm',
  'postCommentsNew': 'most recent',
  'postCommentsBest': 'highest karma',
  'postCommentsDeleted': 'deleted',
  'postCommentsSpam': 'spam',
  'postCommentsReported': 'reported',
}

const DropdownStyle = {
  textShadow: 'inherit',
  display: 'inline-block',
  lineHeight: 'normal',
  fontSize: 'inherit',
  height: 'auto',
};

const DropdownUnderlineStyle = {
  display: 'none',
};

const DropdownIconStyle = {
  display: 'none',
};

const DropdownLabelStyle = {
  lineHeight: 'normal',
  overflow: 'inherit',
  paddingLeft: '0px',
  paddingRight: '0px',
  height: 'normal',
  color: 'inherit',
};

const DropdownListStyle = {
  paddingTop: '4px',
}

class CommentsViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: _.clone(props.router.location.query).view || "postCommentsTop"
    }
  }

  handleChange = (event, index, value) => this.setState({view: value});

  render() {
    console.log("CommentsViews state", this.state);
    console.log("CommentsViews viewNames", viewNames[this.state.view]);
    const props = this.props;
    let views = ["postCommentsTop", "postCommentsNew", "postCommentsBest"];
    const adminViews = ["postCommentsDeleted", "postCommentsSpam", "postCommentsReported"];

    if (Users.canDo(props.currentUser, "comments.edit.all")) {
      views = views.concat(adminViews);
    }

    const query = _.clone(props.router.location.query);
    return (
      <div className="comments-views">
        <DropDownMenu
          value={this.state.view}
          onChange={this.handleChange}
          maxHeight={150}
          style={DropdownStyle}
          underlineStyle={DropdownUnderlineStyle}
          iconStyle={DropdownIconStyle}
          labelStyle={DropdownLabelStyle}
          listStyle={DropdownListStyle}
          className="comments-views-dropdown"
          >
          {views.map(view => {
              const link = <Link
                to={
                  (props.currentUser) ?
                  {pathname: "/", query: {...query, view: view, postId: props.postId, userId: props.currentUser._id}} :
                  {pathname: "/", query: {...query, view: view, postId: props.postId}}
                }/>
              return <MenuItem
                key={view}
                value={view}
                primaryText={viewNames[view]}
                containerElement={link}
                />
            }
          )}
        </DropDownMenu>
      </div>
  )}
}

CommentsViews.propTypes = {
  currentUser: React.PropTypes.object,
  defaultView: React.PropTypes.string
};

CommentsViews.defaultProps = {
  defaultView: "postCommentsTop"
};

CommentsViews.contextTypes = {
  currentRoute: React.PropTypes.object,
  intl: intlShape
};

CommentsViews.displayName = "PostsViews";

registerComponent('CommentsViews', CommentsViews, withRouter);
