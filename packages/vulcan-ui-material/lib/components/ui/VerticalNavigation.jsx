import React from 'react';
import Link from '@mui/material/Link';
import { Link as RLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { registerComponent } from 'meteor/vulcan:lib';

const MenuItem = ({ name, label, path, onClick, labelToken, LeftComponent, RightComponent }, { intl }) => {
  let Wrapper = React.Fragment;
  if (path) {
    const LinkToPath = ({ children }) => (
      <Link component={RLink} to={path}>
        {children}
      </Link>
    );
    Wrapper = LinkToPath;
  }
  return (
    <Wrapper key={name}>
      <ListItem button>
        <div
          //selected={path && router.isActive(path)}
          onClick={onClick}>
          {LeftComponent && <LeftComponent />}
          <span>{label || intl.formatMessage({ id: labelToken })}</span>
          {RightComponent && <RightComponent />}
        </div>
      </ListItem>
    </Wrapper>
  );
};

const VerticalNavigation = ({ links }) => {
  return <List component="nav">{links.map(MenuItem)}</List>;
};

registerComponent('VerticalNavigation', VerticalNavigation);
