import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:lib';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'meteor/vulcan:i18n';

/*

A node contains a menu item, and optionally a list of child items

*/
const Node = ({ childrenItems, ...rest }) => {
  return (
    <div className="menu-node">
      <Item {...rest} />
      {childrenItems &&
        !!childrenItems.length && (
          <div className="menu-node-children">{childrenItems.map((item, index) => <Item key={index} {...item} />)}</div>
        )}
    </div>
  );
};

Node.propTypes = {
  childrenItems: PropTypes.array, // an array of dropdown items used as children of the current item
};

/*

Note: `rest` is used to ensure auto-generated props from parent dropdown
components are properly passed down to MenuItem

*/
const Item = ({ index, to, labelId, label, component, componentProps = {}, itemProps, ...rest }) => {
  let menuComponent;

  if (component) {
    menuComponent = React.cloneElement(component, componentProps);
  } else if (labelId) {
    menuComponent = <FormattedMessage id={labelId} />;
  } else {
    menuComponent = <span>{label}</span>;
  }

  const item = (
    <MenuItem className="dropdown-item" eventKey={index} {...itemProps} {...rest}>
      {menuComponent}
    </MenuItem>
  );

  return to ? <LinkContainer to={to}>{item}</LinkContainer> : item;
};

Item.propTypes = {
  index: PropTypes.number, // index
  to: PropTypes.any, // a string or object, used to generate the router path for the menu item
  labelId: PropTypes.string, // an i18n id for the item label
  label: PropTypes.string, // item label string, used if id is not provided
  component: PropTypes.object, // a component to use as menu item
  componentProps: PropTypes.object, // props passed to the component
  itemProps: PropTypes.object, // props for the <MenuItem/> component
};

const BootstrapDropdown = ({ label, labelId, trigger, menuItems, menuContents, variant = 'dropdown', ...dropdownProps }) => {
  const menuBody = menuContents ? menuContents : menuItems.map((item, index) => {
    if (item === 'divider') {
      return <MenuItem divider key={index} />;
    } else {
      return <Node {...item} key={index} index={index} />;
    }
  });

  if (variant === 'flat') {
    
    return menuBody;

  } else {
    if (trigger) {
      // if a trigger component has been provided, use it
      return (
        <Dropdown {...dropdownProps}>
          <Dropdown.Toggle>{trigger}</Dropdown.Toggle>
          <Dropdown.Menu>{menuBody}</Dropdown.Menu>
        </Dropdown>
      );
    } else {
      // else default to DropdownButton
      return (
        <DropdownButton title={labelId ? <FormattedMessage id={labelId} /> : label} {...dropdownProps}>
          {menuBody}
        </DropdownButton>
      );
    }
  }
};

BootstrapDropdown.propTypes = {
  labelId: PropTypes.string, // menu title/label i18n string
  label: PropTypes.string, // menu title/label
  trigger: PropTypes.object, // component used as menu trigger (the part you click to open the menu)
  menuContents: PropTypes.object, // a component specifying the menu contents
  menuItems: PropTypes.array, // an array of menu items, used if menuContents is not provided
  variant: PropTypes.string, // dropdown (default) or flat
};

registerComponent('Dropdown', BootstrapDropdown);
