import React from 'react';
import merge from 'lodash/merge';
import { storiesOf } from '@storybook/react';

import { Components } from 'meteor/vulcan:core';

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