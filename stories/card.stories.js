import React from 'react';
import { storiesOf } from '@storybook/react';
import { dataSampleCollection } from './dataSample/dummyCollection';

import { Components } from 'meteor/vulcan:core';

/*

Card

*/

const card = storiesOf('Core/Card', module);

const cardProps = {
  collection: dataSampleCollection,
  document: {
    title: 'My title',
    url: 'https://vulcanjs.org',
    image: 'https://cl.ly/6906b7446a73/Screen%20Shot%202019-02-25%20at%2010.19.47.png',
    isTrue: false,
    answerToLife: 42,
    myObject: { foo: 12, bar: 'baz' },
    now: new Date(),
    // component: (
    //   <label>
    //     <input type="checkbox" /> My Checkbox
    //   </label>
    // ),
    array: ['foo', 'bar'],
  },
};

card.add('Default', () => <Components.Card {...cardProps} />);
