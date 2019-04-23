
import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:forms';

storiesOf('vulcan-forms')
.add('FormError - message', () => (
    <Components.FormError error={{
        message:'An error message'
    }}/>
))
.add('FormError intl - no properties', () => (
    <Components.FormError error={{
        id:'intl-id'
    }}/>
))
.add('FormError intl', () => (
    <Components.FormError error={{
        id: 'intl-id',
        properties:{
            name:'address.street'
        }
    }}/>
));