import React from 'react';
import merge from 'lodash/merge';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import { Components } from 'meteor/vulcan:core';
// and then load them in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib';
// we need registered fragments to be initialized because populateComponentsApp will run
// hocs, like withUpdate, that rely on fragments
initializeFragments();
// actually fills the Components object
populateComponentsApp();

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

function capitalize(string) {
  return string.replace(/\-/, ' ').split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
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
storiesOf('UI/Avatar', module).add('Default', () => (
  <Components.Avatar user={{ displayName: 'John Smith' }}/>
));

/*

Button

*/
storiesOf('UI/Button', module).add('Default', () => (
  <Components.Button>Click Me</Components.Button>
));

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