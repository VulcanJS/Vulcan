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
  menuName: PropTypes.string // submenu name (facultative for main menu)
};

const defaultMenuName = 'defaultMenu';
const registeredMenus = {
  [defaultMenuName]: {}
};

export const registerMenuItem = config => {
  const { menuName = defaultMenuName, name, ...otherConfig } = config;
  if (!registeredMenus[menuName]) {
    registeredMenus[menuName] = {};
  }
  registeredMenus[menuName][name] = { name, menuName, ...otherConfig };
};

export const removeMenuItem = (itemId, menuName = defaultMenuName) => {
  delete registeredMenus[menuName][itemId];
  if (
    menuName !== defaultMenuName &&
    Objet.isEmpty(registeredMenus[menuName])
  ) {
    delete registeredMenus[menuName];
  }
};

// should not be needed
export const getMenuItemsConfig = (menuName = defaultMenuName) =>
  registeredMenus[menuName];
export const getAllMenuItemsConfig = () => registeredMenus;

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
export const getMenuItems = (menuName = defaultMenuName) => {
  const menu = registeredMenus[menuName];
  if (!menu) {
    console.warn(
      `Warning: Menu ${menuName} unknown. Menus available: ${Object.keys(
        registeredMenus
      )}`
    );
    return [];
  }
  return values(menu);
};

// { admin: [menuItem1, menuItem2, ...], defaultMenu: [...]}
export const getMenuItemsMap = () =>
  Object.keys(registeredMenus).reduce((res, menuName) => ({
    ...res,
    [menuName]: getMenuItems(menuName)
  }));
