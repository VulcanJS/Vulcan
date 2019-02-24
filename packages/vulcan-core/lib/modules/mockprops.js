/*

Used by Storybook

*/
import { ComponentsMockProps } from 'meteor/vulcan:lib';
import merge from 'lodash/merge';

/*

Defaults & Helpers

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

const onChange = () => {};

const defaultProperties = {
  inputProperties: {
    value: 'hello world',
    onChange,
  },
};

const registerMockProps = (componentName, mockProps) => {
  const componentLabel = componentName.replace('FormComponent', '');
  const dynamicProps = {
    inputProperties: {
      label: `${componentLabel} Input`,
    },
  };
  const props = merge({}, defaultProperties, dynamicProps, mockProps);
  ComponentsMockProps[componentName] = props;
};
/*

Mock Props

*/
registerMockProps('FormComponentCheckbox');

registerMockProps('FormComponentCheckboxGroup', {
  inputProperties: {
    value: ['opt1', 'opt3'],
    options,
  },
});

registerMockProps('FormComponentDate', {
  inputProperties: {
    value: new Date()
  }
});

registerMockProps('FormComponentDate2', {
  inputProperties: {
    value: new Date()
  }
});

registerMockProps('FormComponentDateTime', {
  inputProperties: {
    value: new Date()
  }
});

registerMockProps('FormComponentDefault');

registerMockProps('FormComponentText');

registerMockProps('FormComponentEmail');

registerMockProps('FormComponentNumber', {
  inputProperties: {
    value: 42,
  },
});

registerMockProps('FormComponentRadioGroup', {
  inputProperties: {
    value: 'opt2',
    options,
  },
});

registerMockProps('FormComponentSelect', {
  inputProperties: {
    value: 'opt2',
    options,
  },
});

registerMockProps('FormComponentSelectMultiple');

registerMockProps('FormComponentStaticText');

registerMockProps('FormComponentTextarea');

registerMockProps('FormComponentTime');

registerMockProps('FormComponentUrl');
