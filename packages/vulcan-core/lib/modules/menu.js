/**
 * Menu configuration is a map
 * {
 *  defaultMenu: {
 *    item1: {
 *      ...
 *  }
 *  adminMenu: {
 *    some-item: {
 *      ...
 *    }
 *  }
 *  shortMenu: { ... }
 *  ...
 * }
 */
import values from 'lodash/values';
import Users from 'meteor/vulcan:users';
import PropTypes from 'prop-types';

export const menuItemProps = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelToken: PropTypes.string, // TODO: one of label or labelToken must be defined
  path: PropTypes.string,
  onClick: PropTypes.func,
  LeftComponent: PropTypes.any, //React component @see https://github.com/facebook/prop-types/issues/200
  RightComponent: PropTypes.any,
  groups: PropTypes.arrayOf(PropTypes.string), // groups that can see the item
  menuGroup: PropTypes.string, // submenu name (facultative for main menu)
};

const defaultMenuGroup = 'defaultMenu';
const Menus = {
  [defaultMenuGroup]: {},
};

// only for testing
export const resetMenus = () => {
  Object.keys(Menus).forEach(key => {
    delete Menus[key];
  });
  Menus[defaultMenuGroup] = {};
};
/**
 * 
 * @param {*} config 
 */
export const addMenuItem = config => {
  const { menuGroup = defaultMenuGroup, name, ...otherConfig } = config;
  if (!Menus[menuGroup]) {
    Menus[menuGroup] = {};
  }
  Menus[menuGroup][name] = { name, menuGroup, ...otherConfig };
};

export const removeMenuItem = (itemId, menuGroup = defaultMenuGroup) => {
  delete Menus[menuGroup][itemId];
  if (menuGroup !== defaultMenuGroup && Object.isEmpty(Menus[menuGroup])) {
    delete Menus[menuGroup];
  }
};

// should not be needed
export const getMenuItemsConfig = (menuGroup = defaultMenuGroup) => Menus[menuGroup];
export const getAllMenuItemsConfig = () => Menus;

const filterAuthorized = (currentUser, menuItems) =>
  menuItems.filter(({ groups }) => {
    // items without groups are visible by guests too
    if (!groups) return true;
    return Users.isMemberOf(currentUser, groups);
  });

// same as getMenuItems but filter out unauthorized items
export const getAuthorizedMenuItems = (currentUser, ...args) =>
  filterAuthorized(currentUser, getMenuItems(...args));

// get menu items as an array
export const getMenuItems = (menuGroup = defaultMenuGroup) => {
  const menu = Menus[menuGroup];
  if (!menu) {
    console.warn(
      `Warning: Menu group ${menuGroup} unknown. Menu groups available: ${Object.keys(Menus)}`
    );
    return [];
  }
  return values(menu);
};

// { admin: [menuItem1, menuItem2, ...], defaultMenu: [...]}
export const getMenuItemsMap = () =>
  Object.keys(Menus).reduce((res, menuGroup) => ({
    ...res,
    [menuGroup]: getMenuItems(menuGroup),
  }));
