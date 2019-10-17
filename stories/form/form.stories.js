import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:forms';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

const vulcan_forms = storiesOf('Core/Forms/CoreComponents', module);
vulcan_forms.addDecorator(withKnobs);

vulcan_forms
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
  ));

vulcan_forms
  .add('FormGroupHeader', () => {
    const label = text('Header label', 'myLabel');
    const collapsed = boolean('collapsed', false);
    const hidden = boolean('hidden', false);
    const hasErrors = boolean('hasErrors', false);
    const textInside = text('Text inside', 'My text inside');
    const groupName = text('Group name', 'admin');
    const collapsible = boolean('collapsible', true);
    const group = { name: [groupName], collapsible: collapsible };
    return (
      <div>
        <Components.FormGroupHeader label={label} group={group} />
        <Components.FormGroupLayout
          label="labelInner"
          anchorName="anchorNameInner"
          collapsed={collapsed}
          hidden={hidden}
          hasErrors={hasErrors}
          group={group}>
          {textInside}
        </Components.FormGroupLayout>
      </div>
    );
  })
  .add('FormGroupLine', () => {
    const label = text('Header label', 'myLabel');
    const collapsed = boolean('collapsed', false);
    const hidden = boolean('hidden', false);
    const hasErrors = boolean('hasErrors', false);
    const textInside = text('Text inside', 'My text inside');
    const groupName = text('Group name', 'admin');
    const collapsible = boolean('collapsible', true);
    const group = { name: [groupName], collapsible: collapsible };
    return (
      <div>
        <Components.FormGroupHeaderLine label={label} group={group} />
        <Components.FormGroupLayoutLine
          label="labelInner"
          anchorName="anchorNameInner"
          collapsed={collapsed}
          hidden={hidden}
          hasErrors={hasErrors}
          group={group}>
          {textInside}
        </Components.FormGroupLayoutLine>
      </div>
    );
  })
  .add('FormGroupNone', () => {
    const collapsed = boolean('collapsed', false);
    const hidden = boolean('hidden', false);
    const hasErrors = boolean('hasErrors', false);
    const textInside = text('Text inside', 'My text inside');
    const groupName = text('Group name', 'admin');
    const collapsible = boolean('collapsible', true);
    const group = { name: [groupName], collapsible: collapsible };
    return (
      <div>
        <Components.FormGroupHeaderNone />
        <Components.FormGroupLayoutNone
          label="labelInner"
          anchorName="anchorNameInner"
          collapsed={collapsed}
          hidden={hidden}
          hasErrors={hasErrors}
          group={group}>
          {textInside}
        </Components.FormGroupLayoutNone>
      </div>
    );
  });

vulcan_forms.add('FormNestedArrayLayout - nested item before/after components', () => (
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
));
