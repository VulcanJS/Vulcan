import React from 'react';
import { registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import { getAuthorizedMenuItems, menuItemProps } from 'meteor/vulcan:menu';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';

const MenuItem = (
  {
    name,
    label,
    path,
    onClick,
    // called after the main action is done
    afterClick,
    labelToken,
    LeftComponent,
    RightComponent,
    //  router
  },
  { intl }
) => (
  <li
    key={name}
    //selected={path && router.isActive(path)}
    onClick={
      onClick
        ? () => {
            onClick();
            afterClick && afterClick();
          }
        : () => {
            browserHistory.push(path);
            afterClick && afterClick();
          }
    }>
    {LeftComponent && <LeftComponent />}
    <span>{label || intl.formatMessage({ id: labelToken })}</span>
    {RightComponent && <RightComponent />}
  </li>
);

MenuItem.propTypes = {
  ...menuItemProps,
  // parent can pass another onClick callback
  // eg to close the menu
  afterClick: PropTypes.func,
};

const Layout = ({ children, currentUser }) => {
  const backofficeMenuItems = getAuthorizedMenuItems(currentUser, 'vulcan-backoffice');
  return (
    <div>
      <div>
        <ul>{backofficeMenuItems.map(MenuItem)}</ul>
      </div>
      <div>{children}</div>
    </div>
  );
};

registerComponent({
  name: 'VulcanBackofficeLayout',
  component: Layout,
  hocs: [withCurrentUser],
});
