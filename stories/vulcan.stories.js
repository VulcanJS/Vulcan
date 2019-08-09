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

alerts.forEach(variant =>
  alert.add(capitalize(variant), () => (
    <Components.Alert variant={variant}>{lorem}</Components.Alert>
  ))
);

/*

Avatar

*/
const avatar = storiesOf('UI/Avatar', module);
avatar.addDecorator(withKnobs);

avatar.add('Default', () => {
  const doWrap = boolean('Wrap in parent', false);
  const displayName = text('user.displayName', 'John Smith');
  const avatarUrl = text('user.avatarUrl',
    'https://res.cloudinary.com/picoum/image/upload/v1525703248/KeyBee/Erik_2008_Large_ylfrmh.jpg');
  const isAdmin = boolean('user.isAdmin', false);
  const size = select('size', [null, 'xsmall', 'small', 'medium', 'large', 'profile']);
  const gutter = select('gutter', [null, 'bottom', 'left', 'right', 'sides', 'all', 'none']);
  const link = boolean('link', true);
  
  const avatar = <Components.Avatar user={{ displayName, avatarUrl, isAdmin }}
                                    size={size}
                                    gutter={gutter}
                                    link={link}
  />;
  
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
  const variant = select('variant',
    [null, 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'link',
      'outline-primary', 'outline-secondary', 'outline-success', 'outline-warning', 'outline-danger', 'outline-info',
      'outline-light', 'outline-dark', 'inherit']);
  const size = select('size', [null, 'sm', 'md', 'lg']);
  const iconButton = boolean('iconButton', false);
  const disabled = boolean('disabled', false);
  
  const button = <Components.Button variant={variant} size={size} disabled={disabled} iconButton={iconButton}>
    {iconButton ? <Components.IconAdd/> : children}
  </Components.Button>;
  
  return wrapInParent(button, doWrap);
});

/*

Dropdown

*/
const dropdownProps = {
  label: 'My Dropdown',
  menuItems: [
    { label: 'Item 1' },
    { label: 'Item 2' },
    { label: 'Item 3' },
    { label: 'Item 4' },
  ],
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
  .add('Custom Trigger', () => (
    <Components.Dropdown
      {...merge(dropdownProps, { trigger: <a href="#">Click Me</a> })}
    />
  ));

/*

Modal & ModalTrigger

*/
const modalProps = {
  title: 'My Modal',
  header: 'My Header',
  footer: 'My Footer',
};

storiesOf('UI/Modal', module).add('Default', () => (
  <Components.Modal {...modalProps} show={true}>
    {lorem}
  </Components.Modal>
));

storiesOf('UI/ModalTrigger', module).add('Default', () => (
  <Components.ModalTrigger
    modalProps={modalProps}
    trigger={<a href="#">Click Me</a>}
  >
    <div>{lorem}</div>
  </Components.ModalTrigger>
));

/*

Form Components Stories

*/
const options = [
  {
    label: 'Option 1',
    value: 'opt1',
  },
  {
    label: 'Option 2',
    value: 'opt2',
  },
  {
    label: 'Option 3',
    value: 'opt3',
  },
];

const defaultFormProps = {
  inputProperties: {
    value: 'hello world',
    onChange: () => {},
  },
};

const formComponents = [
  { name: 'FormComponentCheckbox' },
  {
    name: 'FormComponentCheckboxGroup',
    props: {
      inputProperties: {
        value: ['opt1', 'opt3'],
        options,
      },
    },
  },
  {
    name: 'FormComponentDate',
    props: {
      inputProperties: {
        value: new Date(),
      },
    },
  },
  {
    name: 'FormComponentDate2',
    props: {
      inputProperties: {
        value: new Date(),
      },
    },
  },
  {
    name: 'FormComponentDateTime',
    props: {
      inputProperties: {
        value: new Date(),
      },
    },
  },
  { name: 'FormComponentDefault' },
  { name: 'FormComponentText' },
  {
    name: 'FormComponentEmail',
    props: {
      inputProperties: {
        value: 'hello@vulcanjs.org',
      },
    },
  },
  {
    name: 'FormComponentNumber',
    props: {
      inputProperties: {
        value: 42,
      },
    },
  },
  {
    name: 'FormComponentRadioGroup',
    props: {
      inputProperties: {
        value: 'opt2',
        options,
      },
    },
  },
  {
    name: 'FormComponentSelect',
    props: {
      inputProperties: {
        value: 'opt2',
        options,
      },
    },
  },
  { name: 'FormComponentSelectMultiple' },
  { name: 'FormComponentStaticText' },
  { name: 'FormComponentTextarea' },
  { name: 'FormComponentTime' },
  { name: 'FormComponentUrl' },
  { name: 'FormControl' },
  { name: 'FormElement' },
  { name: 'FormItem' },
];

/*

To get form input props, merge:

1. default props common to all inputs
2. specific props for current input
3. dynamic props generated from name
4. props specific to the current story

*/
const getFormProps = (componentName, storyProps) => {
  const component = formComponents.find(c => c.name === componentName);
  const componentLabel = componentName.replace('FormComponent', '');
  const dynamicProps = {
    inputProperties: {
      label: `${componentLabel} Input`,
    },
  };
  return merge({}, defaultFormProps, component.props, dynamicProps, storyProps);
};

formComponents.forEach(item => {
  const { name } = item;
  const Component = Components[name];
  const componentLabel = name.replace('FormComponent', '');
  const storyName = `Forms/${componentLabel}`;
  if (Component) {
    storiesOf(storyName, module)
      .add('Horizontal Layout', () => <Component {...getFormProps(name)} />)
      .add('Input Only', () => (
        <Component
          {...getFormProps(name, {
            itemProperties: { layout: 'inputOnly' },
          })}
        />
      ));
  }
});

/*

Core Components

*/

/*

Card

*/
const cardProps = {
  document: {
    title: 'My title',
    url: 'https://vulcanjs.org',
    image:
      'https://cl.ly/6906b7446a73/Screen%20Shot%202019-02-25%20at%2010.19.47.png',
    isTrue: false,
    answerToLife: 42,
    myObject: { foo: 12, bar: 'baz' },
    now: new Date(),
    component: (
      <label>
        <input type="checkbox" /> My Checkbox
      </label>
    ),
    array: [1, 2, 'foo', 'bar'],
  },
};
storiesOf('Core/Card', module).add('Default', () => (
  <Components.Card {...cardProps} />
));

/*

Datatable

*/

// TODO
