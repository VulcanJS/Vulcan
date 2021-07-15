import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { replaceComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    flexDirection: 'row-reverse',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    height: 'auto',
  },
  typography: {
    marginRight: theme.spacing(1),
  },
});

export function hasPasswordService() {
  // First look for OAuth services.
  return !!Package['accounts-password'];
}

export class AccountsPasswordOrService extends PureComponent {
  render() {
    let { className = 'password-or-service', classes } = this.props;
    const services = Object.keys(this.props.oauthServices).map(service => {
      return this.props.oauthServices[service].label;
    });
    let labels = services;
    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService() && services.length > 0) {
      return (
        <CardActions className={classNames(className, classes.root)}>
          <Typography variant="caption" className={classes.typography} align="right">
            {`${this.context.intl.formatMessage({ id: 'accounts.or_use' })} ${labels.join(' / ')}`}
          </Typography>
        </CardActions>
      );
    }
    return null;
  }
}

AccountsPasswordOrService.propTypes = {
  oauthServices: PropTypes.object,
};

AccountsPasswordOrService.contextTypes = {
  intl: intlShape,
};

replaceComponent('AccountsPasswordOrService', AccountsPasswordOrService, [withStyles, styles]);
