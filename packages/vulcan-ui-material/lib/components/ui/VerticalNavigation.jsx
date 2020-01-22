import React from 'react';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { registerComponent } from 'meteor/vulcan:lib';

const MenuItem = (
  { name, label, path, onClick, labelToken, LeftComponent, RightComponent },
  { intl }
) => {
  let Wrapper = React.Fragment;
  if (path) {
    const LinkToPath = ({ children }) => <Link href={path}>{children}</Link>;
    Wrapper = LinkToPath;
  }
  return (
    <ListItem button>
      <Wrapper key={name}>
        <div
          //selected={path && router.isActive(path)}
          onClick={onClick}>
          {LeftComponent && <LeftComponent />}
          <span>{label || intl.formatMessage({ id: labelToken })}</span>
          {RightComponent && <RightComponent />}
        </div>
      </Wrapper>
    </ListItem>
  );
};

const VerticalNavigation = ({links}) => {
  console.log(links);
  return (
    <List component="nav">
      { links.map(MenuItem) }
    </List>
  );
};

registerComponent('VerticalNavigation', VerticalNavigation);
