import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:forms';

const options = [{
    value: 'Afghan',
    label: 'Afghan',
  },
  {
    value: 'Albanais',
    label: 'Albanais',
  },
  {
    value: 'Algérien',
    label: 'Algérien',
  },
  {
    value: 'Allemand',
    label: 'Allemand',
  },
  {
    value: 'Belge',
    label: 'Belge',
  },
  {
    value: 'Beninois',
    label: 'Beninois',
  },
  {
    value: 'Bosniaque',
    label: 'Bosniaque',
  },
  {
    value: 'Botswanais',
    label: 'Botswanais',
  }]

storiesOf('vulcan-forms')
  .add('FormError - message', () => (
    <Components.FormError
      error={{
        message: 'An error message',
      }}
    />
  ))
  .add('FormError intl - no properties', () => (
    <Components.FormError
      error={{
        id: 'intl-id',
      }}
    />
  ))
  .add('FormError intl', () => (
    <Components.FormError
      error={{
        id: 'intl-id',
        properties: {
          name: 'address.street',
        },
      }}
    />
  ))
  .add('FormNestedArrayLayout - nested item before/after components', () => (
    <Components.FormNestedArray
      value={[{ name: 'Jane' }, { name: 'DELETED' }, { name: 'John' }]}
      deletedValues={['peoples.1']}
      path="peoples"
      formComponents={{
        ...Components,
        FormNestedItem: () => (
          <div>
            <input />
          </div>
        ),
      }}
      errors={[]}
      updateCurrentValues={action('updateCurrentValues')}
      arrayField={{
        beforeComponent: props => (
          <div>
            BEFORE {props.itemIndex} {props.visibleItemIndex}
          </div>
        ),
        afterComponent: props => <div>AFTER</div>,
      }}
    />
  ))
  .add('Form base-controls MuiSuggest', () => (
    <Components.MuiSuggest
      options={options}
    />
  ));
