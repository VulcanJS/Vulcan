import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:forms';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

const vulcanForms = storiesOf('Core/Forms/CoreComponents', module);
vulcanForms.addDecorator(withKnobs);

vulcanForms.add('FormComponentInner with Date component', () => {
  const name = text('Name', 'myForm');
  const beforeComponent = text('beforeComponent', 'beforeComponent');
  const afterComponent = text('afterComponent', 'afterComponent');
  const help = text('help', 'help');
  const showCharsRemaining = boolean('showCharsRemaining', false);
  return (
    <Components.FormComponentInner
      name={name}
      errors={[]}
      onChange={action('call onChange function')}
      showCharsRemaining={showCharsRemaining}
      formInput={Components.FormComponentDate}
      beforeComponent={<div>{beforeComponent}</div>}
      afterComponent={<div>{afterComponent}</div>}
      help={<div>{help}</div>}
    />
  );
});

vulcanForms
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

vulcanForms
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

vulcanForms.add('FormNestedArrayLayout - nested item before/after components', () => (
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

vulcanForms.add('FormSubmit', () => {
  const submitLabel = text('Submit Label', 'Submit Label');
  return <Components.FormSubmit submitLabel={submitLabel} />;
});
