import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import { useCurrentUser } from '../containers/currentUser';
import Users from 'meteor/vulcan:users';
import { useHistory } from 'react-router-dom';
import { withMessages } from '../containers/withMessages';
import { intlShape } from 'meteor/vulcan:i18n';

const AccessControl = ({ currentRoute, children, flash }, { intl }) => {
  const { loading, currentUser } = useCurrentUser();
  const { access } = currentRoute;
  const history = useHistory();

  if (!access) {
    return children;
  }

  const { groups, redirect, redirectMessage, check } = access;

  if (loading) {
    return <Components.Loading />;
  } else if (!currentUser) {
    if (redirect) {
      history.push(redirect);
      flash(
        redirectMessage ? redirectMessage : intl.formatMessage({ id: 'app.please_sign_up_log_in', defaultMessage: 'Please log in first.' })
      );
      return null;
    } else {
      return <Components.DefaultLogInFailureComponent {...access} />;
    }
  } else {
    const canAccess = check ? check(currentUser, currentRoute) : groups ? Users.isMemberOf(currentUser, groups) : true;
    return canAccess ? children : <FailureComponent {...access} />;
  }
};

AccessControl.displayName = 'AccessControl';

AccessControl.contextTypes = {
  intl: intlShape,
};

registerComponent({ name: 'AccessControl', component: AccessControl, hocs: [withMessages] });

const FailureComponent = props => {
  const { failureComponentName, failureComponent, ...rest } = props;
  if (failureComponentName) {
    const FailureComponent = Components[failureComponentName];
    return <FailureComponent {...rest} />;
  } else if (failureComponent) {
    const FailureComponent = failureComponent; // necesary because jsx components must be uppercase
    return <FailureComponent {...rest} />;
  } else return <Components.DefaultPermissionFailureComponent {...rest} />;
};

const DefaultLogInFailureComponent = () => (
  <Components.Alert className="access-control-failure" variant="danger">
    <Components.FormattedMessage id="app.please_sign_up_log_in" defaultMessage="Please log in first." />
  </Components.Alert>
);

registerComponent({ name: 'DefaultLogInFailureComponent', component: DefaultLogInFailureComponent });

const DefaultPermissionFailureComponent = () => (
  <Components.Alert className="access-control-failure" variant="danger">
    <Components.FormattedMessage id="app.no_access_permissions" defaultMessage="Sorry, you are not allowed to access this page." />
  </Components.Alert>
);

registerComponent({ name: 'DefaultPermissionFailureComponent', component: DefaultPermissionFailureComponent });

export default AccessControl;
