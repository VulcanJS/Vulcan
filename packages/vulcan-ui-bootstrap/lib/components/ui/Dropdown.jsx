import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import { LinkContainer } from 'react-router-bootstrap';

/*

Note: rest is used to ensure auto-generated props from parent dropdown
components are properly passed down to MenuItem

*/
const Item = ({ index, to, component, itemProps, ...rest }) => {
  const item = (
    <MenuItem eventKey={index} {...itemProps} {...rest}>
      {component}
    </MenuItem>
  );
  return to ? <LinkContainer to={to}>{item}</LinkContainer> : item;
};

const BootstrapDropdown = ({ label, trigger, menuItems, ...dropdownProps }) => {

  const menuContents = menuItems.map((item, index) => {
    if (item === 'divider') {
      return <MenuItem divider key={index} />;
    } else {
      return <Item {...item} key={index} index={index} />;
    }
  });

  if (trigger) {
    // if a trigger component has been provided, use it
    return (
      <Dropdown {...dropdownProps}>
        <Dropdown.Toggle>{trigger}</Dropdown.Toggle>
        <Dropdown.Menu>{menuContents}</Dropdown.Menu>
      </Dropdown>
    );
  } else {
    // else default to DropdownButton
    return (
      <DropdownButton title={label} {...dropdownProps}>
        {menuContents}
      </DropdownButton>
    );
  }
};

registerComponent('Dropdown', BootstrapDropdown);
