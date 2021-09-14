import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from 'mdi-material-ui/ChevronUp';
import ExpandMoreIcon from 'mdi-material-ui/ChevronDown';
import LockIcon from 'mdi-material-ui/Lock';
import UsersIcon from 'mdi-material-ui/AccountMultiple';
import ThemeIcon from 'mdi-material-ui/Palette';
import HomeIcon from 'mdi-material-ui/Home';
import withStyles from '@mui/styles/withStyles';
import Users from 'meteor/vulcan:users';

const styles = theme => ({
  root: {},
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

class SideNavigation extends React.Component {
  state = {
    isOpen: { admin: false },
  };

  toggle = item => {
    const newState = { isOpen: {} };
    newState.isOpen[item] = !this.state.isOpen[item];
    this.setState(newState);
  };

  render() {
    const { currentUser, classes, history } = this.props;
    const isOpen = this.state.isOpen;

    return (
      <div className={classes.root}>
        <List>
          <ListItem
            button
            onClick={() => {
              history.push('/');
            }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText inset primary="Home" />
          </ListItem>
        </List>

        {Users.isAdmin(currentUser) && (
          <div>
            <Divider />
            <List>
              <ListItem button onClick={e => this.toggle('admin')}>
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
                {isOpen.admin ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={isOpen.admin} transitionduration="auto" unmountOnExit>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => {
                    history.push('/admin');
                  }}>
                  <ListItemIcon>
                    <UsersIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Users" />
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => {
                    history.push('/theme');
                  }}>
                  <ListItemIcon>
                    <ThemeIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Theme" />
                </ListItem>
              </Collapse>
            </List>
          </div>
        )}
      </div>
    );
  }
}

SideNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};

SideNavigation.displayName = 'SideNavigation';

registerComponent(
  'SideNavigation',
  SideNavigation,
  [withStyles, styles],
  withCurrentUser,
  withRouter
);
