import React from 'react';
import merge from 'lodash/merge';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { capitalize, wrapInParent, lorem } from './helpers';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import { Components } from 'meteor/vulcan:core';

/*

UI Components Stories

*/

/*

Alert

*/
const alerts = ['primary', 'secondary', 'success', 'danger', 'warning'];

const alert = storiesOf('UI/Alert', module);

alerts.forEach(variant => alert.add(capitalize(variant), () => <Components.Alert variant={variant}>{lorem}</Components.Alert>));

/*

Avatar

*/
const avatar = storiesOf('UI/Avatar', module);
avatar.addDecorator(withKnobs);

avatar.add('Default', () => {
  const doWrap = boolean('Wrap in parent', false);
  const displayName = text('user.displayName', 'John Smith');
  const avatarUrl = text('user.avatarUrl', 'https://res.cloudinary.com/picoum/image/upload/v1525703248/KeyBee/Erik_2008_Large_ylfrmh.jpg');
  const isAdmin = boolean('user.isAdmin', false);
  const size = select('size', [null, 'xsmall', 'small', 'medium', 'large', 'profile']);
  const gutter = select('gutter', [null, 'bottom', 'left', 'right', 'sides', 'all', 'none']);
  const link = boolean('link', true);

  const avatar = <Components.Avatar user={{ displayName, avatarUrl, isAdmin }} size={size} gutter={gutter} link={link} />;

  return wrapInParent(avatar, doWrap);
});

/*

Button

*/
const button = storiesOf('UI/Button', module);
button.addDecorator(withKnobs);

button.add('Default', () => {
  const doWrap = boolean('Wrap in parent', false);
  const children = text('children', 'Click Me');
  const variant = select('variant', [
    null,
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
    'link',
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-warning',
    'outline-danger',
    'outline-info',
    'outline-light',
    'outline-dark',
    'inherit',
  ]);
  const size = select('size', [null, 'sm', 'md', 'lg']);
  const iconButton = boolean('iconButton', false);
  const disabled = boolean('disabled', false);

  const button = (
    <Components.Button variant={variant} size={size} disabled={disabled} iconButton={iconButton}>
      {iconButton ? <Components.IconAdd /> : children}
    </Components.Button>
  );

  return wrapInParent(button, doWrap);
});

/*

Dropdown

*/
const dropdownProps = {
  label: 'My Dropdown',
  menuItems: [{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }, { label: 'Item 4' }],
};

storiesOf('UI/Dropdown', module)
  .add('Default', () => <Components.Dropdown {...dropdownProps} />)
  .add('Custom Menu Items', () => (
    <Components.Dropdown
      {...merge(dropdownProps, {
        menuItems: [
          {
            component: (
              <label>
                <input type="checkbox" />
                My Checkbox
              </label>
            ),
          },
        ],
      })}
    />
  ))
  .add('Custom Content', () => (
    <Components.Dropdown
      {...merge(dropdownProps, {
        menuContents: <div style={{ padding: 20 }}>{lorem}</div>,
      })}
    />
  ))
  .add('Custom Trigger', () => <Components.Dropdown {...merge(dropdownProps, { trigger: <a href="#">Click Me</a> })} />);
