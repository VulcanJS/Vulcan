import React from 'react';
import { storiesOf } from '@storybook/react';
import { Components, registerComponent } from 'meteor/vulcan:core';

const ChildComponent = React.forwardRef((props, ref) => {
  return (
    <input
      type='text'
      ref={ref} />
  )
});

registerComponent({ name: 'ChildComponent', component: ChildComponent });


const FatherComponent = props => {
  const textInput = React.createRef();
  const focusTextInput = () => textInput.current.focus();
  return (
      <div>
        <Components.ChildComponent ref={textInput} />
        <input
          type='button'
          value='Focus the text input in ChildComponent'
          onClick={focusTextInput}
        />
      </div>
  );
};

registerComponent({ name: 'FatherComponent', component: FatherComponent });

const refs = storiesOf('Example/refs', module);

refs.add('Default', () => {
  return <Components.FatherComponent />;
});
