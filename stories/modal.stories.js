import React from 'react';
import { storiesOf } from '@storybook/react';
import { lorem } from './helpers';

import { Components } from 'meteor/vulcan:core';
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

storiesOf('UI/ModalTrigger', module)
  .add('trigger', () => (
    <Components.ModalTrigger modalProps={modalProps} trigger={<a href="#">Click Me</a>}>
      <div>{lorem}</div>
    </Components.ModalTrigger>
  ))
  .add('component', () => (
    <Components.ModalTrigger modalProps={modalProps} component={<a href="#">Click Me</a>}>
      <div>{lorem}</div>
    </Components.ModalTrigger>
  ))
  .add('label', () => (
    <Components.ModalTrigger modalProps={modalProps} label="Click me">
      <div>{lorem}</div>
    </Components.ModalTrigger>
  ));
