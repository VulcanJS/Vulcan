import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { hasPasswordService } from '../../helpers.js';

export class PasswordOrService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPasswordService: hasPasswordService(),
      services: Object.keys(props.oauthServices).map(service => {
        return props.oauthServices[service].label
      })
    };
  }

  render () {
    let { className = "password-or-service", style = {} } = this.props;
    let { hasPasswordService, services } = this.state;
    labels = services;
    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService && services.length > 0) {
      return (
        <div style={ style } className={ className }>
          { `${T9n.get('orUse')} ${ labels.join(' / ') }` }
        </div>
      );
    }
    return null;
  }
}
PasswordOrService.propTypes = {
  oauthServices: React.PropTypes.object
};

Accounts.ui.PasswordOrService = PasswordOrService;
