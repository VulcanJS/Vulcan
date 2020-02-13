import React, { useState, useEffect, useRef } from 'react';
import { getAuthorizedMenuItems, menuItemProps, registerComponent, withCurrentUser, Components } from 'meteor/vulcan:core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

const MenuItem = ({ name, label, path, onClick, labelToken, LeftComponent, RightComponent }, { intl }) => {
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
  const [open, setOpen] = useState(true);

  const backofficeMenuItems = getAuthorizedMenuItems(currentUser, 'vulcan-backoffice');

  const side = <Components.VerticalNavigation links={backofficeMenuItems} />;

  return (
    <Components.BackofficePageLayout>
      <Components.BackofficeNavbar
        onClick={() => {
          setOpen(!open);
        }}
        basePath={'/backoffice'}
      />

      <Components.BackofficeVerticalMenuLayout side={side} main={children} open={open} />
    </Components.BackofficePageLayout>
  );
};

const accessOptions = {
  groups: ['admins'],
  redirect: '/',
  message: 'Sorry, you do not have the rights to access this page.',
};

registerComponent({
  name: 'VulcanBackofficeLayout',
  component: Layout,
  hocs: [withRouter, withCurrentUser, [withAccess, accessOptions]],
});
