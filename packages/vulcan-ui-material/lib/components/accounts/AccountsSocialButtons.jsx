import React from 'react';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import CardActions from '@material-ui/core/CardActions';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    justifyContent: 'flex-end',
    padding: theme.spacing.unit * 2,
    height: 'auto',
  },
});

export class AccountsSocialButtons extends React.Component {
  render() {
    let { oauthServices = {}, className = 'social-buttons', classes } = this.props;
    return(
      <CardActions className={classNames(classes.root, className)}>
        {Object.keys(oauthServices).map((id, i) => {
          return <Components.AccountsButton {...oauthServices[id]} key={i} />;
        })}
      </CardActions>
    );
  }
}

replaceComponent('AccountsSocialButtons', AccountsSocialButtons, [withStyles, styles]);
