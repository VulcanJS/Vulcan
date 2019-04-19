import merge from 'lodash/merge';

/*

Simplified versions of Vulcan APIs and helpers

*/

/*

Components

*/
export const Components = {}; // will be populated on startup (see vulcan:routing)

export const ComponentsMockProps = {};

export const getMockProps = (componentName, overrideProps) => {
  return merge({}, ComponentsMockProps[componentName], overrideProps);
};

export function registerComponent(name, rawComponent, ...hocs) {
  // support single-argument syntax
  if (typeof arguments[0] === 'object') {
    // note: cannot use `const` because name, components, hocs are already defined
    // as arguments so destructuring cannot work
    // eslint-disable-next-line no-redeclare
    var { name, component, hocs = [] } = arguments[0];
    rawComponent = component;
  }
  // store the component in the table
  Components[name] = rawComponent
}

export const replaceComponent = registerComponent;

export const instantiateComponent = (component, props) => {
  if (!component) {
    return null;
  } else if (typeof component === 'string') {
    const Component = getComponent(component);
    return <Component {...props} />;
  } else if (
    typeof component === 'function' &&
    component.prototype &&
    component.prototype.isReactComponent
  ) {
    const Component = component;
    return <Component {...props} />;
  } else if (typeof component === 'function') {
    return component(props);
  } else {
    return component;
  }
};

export const coreComponents = [
  'Alert',
  'Button',
  'Dropdown',
  'Modal',
  'ModalTrigger',
  'Table',
  'FormComponentCheckbox',
  'FormComponentCheckboxGroup',
  'FormComponentDate',
  'FormComponentDate2',
  'FormComponentDateTime',
  'FormComponentDefault',
  'FormComponentText',
  'FormComponentEmail',
  'FormComponentNumber',
  'FormComponentRadioGroup',
  'FormComponentSelect',
  'FormComponentSelectMultiple',
  'FormComponentStaticText',
  'FormComponentTextarea',
  'FormComponentTime',
  'FormComponentUrl',
  'FormControl',
  'FormElement',
  'FormItem',
];

/*

i18n

*/

export const Strings = {};

export const addStrings = (language, strings) => {
  if (typeof Strings[language] === 'undefined') {
    Strings[language] = {};
  }
  Strings[language] = {
    ...Strings[language],
    ...strings
  };
};

export const Locales = [];

export const registerLocale = locale => {
  Locales.push(locale);
};

/*

Users

*/

export const isAdmin = () => true;
export const getProfileUrl = (user, isAbsolute) => {
  if (typeof user === 'undefined') {
    return '';
  }
  isAbsolute = typeof isAbsolute === 'undefined' ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Utils.getSiteUrl().slice(0, -1) : '';
  if (user.slug) {
    return `${prefix}/users/${user.slug}`;
  } else {
    return '';
  }
};
export const getDisplayName = (user) => {
  if (!user) {
    return '';
  } else {
    return user.displayName ? user.displayName : Users.getUserName(user);
  }
};
export const avatar = {
  getUrl: user => 'https://api.adorable.io/avatars/285/abotaat@adorable.io.png',
  getInitials: user => 'SG',
}
/*

Helpers

*/

export function capitalize(string) {
  return string.replace(/\-/, ' ').split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

/*

Other Exports

*/

export const getSetting = (name, defaultSetting) => defaultSetting;

export const track = () => {};
export const addCallback = () => {};

export const withCurrentUser = c => c;
export const withUpdate = c => c;