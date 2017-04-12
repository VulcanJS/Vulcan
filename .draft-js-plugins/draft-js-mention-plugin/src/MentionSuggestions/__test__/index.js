import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { fromJS } from 'immutable';

import MentionSuggestions from '../index';

const mentions = fromJS([
  {
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
    avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
  },
  {
    name: 'Julian Krispel-Samsel',
    link: 'https://twitter.com/juliandoesstuff',
    avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
  },
  {
    name: 'Jyoti Puri',
    link: 'https://twitter.com/jyopur',
    avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
  },
  {
    name: 'Max Stoiber',
    link: 'https://twitter.com/mxstbr',
    avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
  },
  {
    name: 'Nik Graf',
    link: 'https://twitter.com/nikgraf',
    avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
  },
  {
    name: 'Pascal Brandt',
    link: 'https://twitter.com/psbrandt',
    avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
  },
]);


function defaultProps() {
  return {
    suggestions: mentions,
    callbacks: {
      onDownArrow: sinon.spy(),
      onUpArrow: sinon.spy(),
      onTab: sinon.spy(),
      onEscape: sinon.spy(),
      handleReturn: sinon.spy()
    },
    store: {
      getAllSearches: sinon.spy(() => ({ has: () => false })),
      getPortalClientRect: sinon.spy(),
      isEscaped: sinon.spy(),
      resetEscapedSearch: sinon.spy(),
      escapeSearch: sinon.spy(),
    },
    ariaProps: {},
    onSearchChange: sinon.spy(),
    onAddMention: sinon.spy(),
    positionSuggestions: sinon.stub().returns({}),
    theme: {},
  };
}

describe('MentionSuggestions Component', () => {
  it('Closes when suggestions is empty', () => {
    const props = defaultProps();
    const suggestions = mount(
      <MentionSuggestions {...props} />
    );

    suggestions.instance().openDropdown();
    expect(suggestions.state().isActive).to.equal(true);

    suggestions.setProps({
      suggestions: fromJS([]),
    });
    expect(suggestions.state().isActive).to.equal(false);
  });

  it('The popoverComponent prop changes the popover component', () => {
    const PopoverComponent = ({ children, ...props }) => (
      <div data-test-test {...props}>{children}</div>
    );

    const props = defaultProps();
    props.popoverComponent = <PopoverComponent />;
    const suggestions = mount(
      <MentionSuggestions {...props} />
    );

    suggestions.instance().openDropdown();
    expect(suggestions.find('[data-test-test]')).to.have.length(1);
  });

  it('The popoverComponent recieves the children', () => {
    let called = false;
    const PopoverComponent = ({ children, ...props }) => {
      called = true;
      expect(React.Children.count(children)).to.equal(mentions.length);
      return <div {...props}>{children}</div>;
    };

    const props = defaultProps();
    props.popoverComponent = <PopoverComponent />;
    const suggestions = mount(
      <MentionSuggestions {...props} />
    );

    suggestions.instance().openDropdown();
    expect(called).to.equal(true);
  });

  it('The popoverComponent prop uses div by default', () => {
    const props = defaultProps();
    const suggestions = mount(
      <MentionSuggestions {...props} data-findme />
    );

    suggestions.instance().openDropdown();
    expect(suggestions.find('div[data-findme]')).to.have.length(1);
  });
});
