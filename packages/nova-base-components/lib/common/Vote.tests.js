import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import Vote from './Vote.jsx'

describe(() => {
  it('should render', () => {
    const post = { }; //FIXME
    const user = null; //FIXME
    const wrapper = shallow(<Vote post={post} currentUser={user} />);
    chai.assert(wrapper.hasClass('vote'));
    chai.assert(!wrapper.hasClass('voted'));
    chai.assert.equal(item.find('.vote-count').text(), '0');
  });
});
