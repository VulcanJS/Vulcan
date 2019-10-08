import React from 'react';
import { registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import { getAuthorizedMenuItems, menuItemProps } from 'meteor/vulcan:menu';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MenuItem = (
  { name, label, path, onClick, labelToken, LeftComponent, RightComponent },
  { intl }
) => {
  let Wrapper = React.Fragment;
  if (path) {
    const LinkToPath = ({ children }) => <Link to={path}>{children}</Link>;
    Wrapper = LinkToPath;
  }
  return (
    <Wrapper key={name}>
      <li
        //selected={path && router.isActive(path)}
        onClick={onClick}>
        {LeftComponent && <LeftComponent />}
        <span>{label || intl.formatMessage({ id: labelToken })}</span>
        {RightComponent && <RightComponent />}
      </li>
    </Wrapper>
  );
};

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
