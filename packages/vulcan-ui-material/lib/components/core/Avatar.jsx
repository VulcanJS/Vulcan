import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { Link } from 'react-router-dom';
import Users, { getProfileUrl } from 'meteor/vulcan:users';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiAvatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import AdminIcon from 'mdi-material-ui/Star';
import classNames from 'classnames';


const styles = theme => ({
  
  root: {
    padding: 0,
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
    position: 'relative',
  },
  
  avatar: {},
  
  statusIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.9))',
  },
  
  statusIconProfile: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.9))',
  },
  
  admin: {
    color: theme.palette.error.main,
  },
  
  host: {
    color: theme.palette.secondary.main,
  },
  
  icon: {
    width: 24,
    height: 24,
  },
  
  xsmall: {
    width: 32,
    height: 32,
  },
  
  small: {
    width: 40,
    height: 40,
  },
  
  medium: {
    width: 48,
    height: 48,
  },
  
  large: {
    width: 56,
    height: 56,
  },
  
  profile: {
    width: 120,
    height: 120,
  },
  
  bottom: {
    marginBottom: theme.spacing.unit,
  },
  
  left: {
    marginLeft: theme.spacing.unit,
  },
  
  right: {
    marginRight: theme.spacing.unit,
  },
  
  sides: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },
  
  all: {
    margin: theme.spacing.unit,
  },
  
  none: {},
  
});


const Avatar = ({
                  classes,
                  className,
                  user,
                  size,
                  gutter,
                  link,
                  buttonRef,
                }, { intl }) => {
  
  let avatarUrl = user.avatarUrl || Users.avatar.getUrl(user);
  if (avatarUrl && avatarUrl.indexOf('gravatar.com') > -1) avatarUrl = null;
  const statusIconClass = `statusIcon${size === 'profile' ? 'Profile' : ''}`;
  const userStatus = Users.avatar.getUserStatus(user);
  
  const statusIcon = userStatus &&
    <Tooltip title={intl.formatMessage({ id: `users.${userStatus}` })} placement="bottom">
      <AdminIcon className={classNames(classes[statusIconClass], classes[userStatus])}/>
    </Tooltip>;
  
  const avatar =
    <MuiAvatar alt={Users.getDisplayName(user)}
               src={avatarUrl}
               className={classNames('users-avatar', classes[size], classes.avatar)}
               data-email={Users.getEmail(user)}
    >
      {
        !avatarUrl
          ?
          Users.avatar.getInitials(user)
          :
          null
      }
    </MuiAvatar>;
  
  //onClick = onClick || function () { RouteTools.go('users.profile', { slug: user.slug }); };
  
  return (
    link
      
      ?
      
      <ButtonBase className={className}
                  classes={{ root: classNames(classes.root, classes[gutter]) }}
                  component={Link}
                  ref={buttonRef}
                  to={getProfileUrl(user)}
      >
        {avatar}
        {statusIcon}
      </ButtonBase>
      
      :
      
      <div className={classNames(classes.root, classes[gutter], className)}>
        {avatar}
        {statusIcon}
      </div>
  );
  
};


Avatar.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'profile']),
  gutter: PropTypes.oneOf(['bottom', 'left', 'right', 'sides', 'all', 'none']),
  link: PropTypes.bool,
  buttonRef: PropTypes.func,
};


Avatar.defaultProps = {
  size: 'small',
  gutter: 'none',
  link: true,
};


Avatar.contextTypes = {
  intl: intlShape.isRequired,
};


Avatar.displayName = 'Avatar';


registerComponent('Avatar', Avatar, [withStyles, styles]);
