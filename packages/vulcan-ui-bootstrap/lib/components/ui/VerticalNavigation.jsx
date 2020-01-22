import React from 'react';
import Nav from 'react-bootstrap/Nav';

import { registerComponent } from 'meteor/vulcan:lib';

const MenuItem = (
  { name, label, path, onClick, labelToken, LeftComponent, RightComponent },
  { intl }
) => {
  let Wrapper = React.Fragment;
  if (path) {
    const LinkToPath = ({ children }) => <Nav.Link href={path}>{children}</Nav.Link>;
    Wrapper = LinkToPath;
  }
  return (
    <Wrapper key={name}>
      <div
        //selected={path && router.isActive(path)}
        onClick={onClick}>
        {LeftComponent && <LeftComponent />}
        <span>{label || intl.formatMessage({ id: labelToken })}</span>
        {RightComponent && <RightComponent />}
      </div>
    </Wrapper>
  );
};

const VerticalNavigation = ({links}) => {
  console.log(links);
  return (
    <Nav className="flex-column">
      { links.map(MenuItem) }
    </Nav>
  );
};

registerComponent('VerticalNavigation', VerticalNavigation);
