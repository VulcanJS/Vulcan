import { createFactory } from 'react';

export const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export const setStatic = (key, value) => BaseComponent => {
  /* eslint-disable no-param-reassign */
  BaseComponent[key] = value;
  /* eslint-enable no-param-reassign */
  return BaseComponent;
};

export const getDisplayName = Component => {
  if (typeof Component === 'string') {
    return Component;
  }

  if (!Component) {
    return undefined;
  }

  return Component.displayName || Component.name || 'Component';
};

export const wrapDisplayName = (BaseComponent, hocName) => `${hocName}(${getDisplayName(BaseComponent)})`;

export const setDisplayName = displayName => setStatic('displayName', displayName);

export const getContext = contextTypes => BaseComponent => {
  const factory = createFactory(BaseComponent);
  const GetContext = (ownerProps, context) =>
    factory({
      ...ownerProps,
      ...context,
    });

  GetContext.contextTypes = contextTypes;

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(GetContext);
  }
  return GetContext;
};
