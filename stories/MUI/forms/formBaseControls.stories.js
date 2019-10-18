import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:forms';
import { withKnobs, boolean } from '@storybook/addon-knobs';

const vulcanFormsBaseControls = storiesOf('MUI/Forms/BaseControls', module);
vulcanFormsBaseControls.addDecorator(withKnobs);

const options = [
  {
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
  },
];

vulcanFormsBaseControls
  .add('Form base-controls MuiSuggest', () => <Components.MuiSuggest options={options} />)
  .add('Form base-controls MuiRequiredIndicator', () => {
    const optional = boolean('optional', false);
    return <Components.RequiredIndicator optional={optional} />;
  });
