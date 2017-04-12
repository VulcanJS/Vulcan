/* eslint-disable jsx-a11y/anchor-has-content,react/no-children-prop */

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Link from '../index';

describe('Link', () => {
  it('applies the className based on the theme property `link`', () => {
    const theme = { link: 'custom-class-name' };
    const result = shallow(<Link theme={theme} />);
    expect(result).to.have.prop('className', 'custom-class-name');
  });

  it('applies any custom passed prop', () => {
    const result = shallow(<Link data-custom="unicorn" />);
    expect(result).to.have.prop('data-custom', 'unicorn');
  });

  it('renders the passed in children', () => {
    const result = shallow(<Link children="https://www.draft-js-plugins.com/" />);
    expect(result).to.have.prop('children', 'https://www.draft-js-plugins.com/');
  });

  it('applies a custom className as well as the theme', () => {
    const theme = { link: 'custom-class-name' };
    const result = shallow(<Link theme={theme} className="link" />);
    expect(result).to.have.prop('className').to.contain('link');
    expect(result).to.have.prop('className').to.contain('custom-class-name');
  });

  it('uses the decoratedText prop as href', () => {
    const result = shallow(<Link decoratedText="https://www.draft-js-plugins.com/" />);
    expect(result).to.have.prop('href').to.contain('https://www.draft-js-plugins.com/');
  });

  it('applies http prefix when none is supplied', () => {
    const result = shallow(<Link decoratedText="draft-js-plugins.com/" />);
    expect(result).to.have.prop('href').to.contain('http://draft-js-plugins.com/');
  });

  it('does not apply a prefix when one is already supplied', () => {
    const result = shallow(<Link decoratedText="ftp://draft-js-plugins.com/" />);
    expect(result).to.have.prop('href').to.contain('ftp://draft-js-plugins.com/');
  });

  it('generates correct href to localhost with port', () => {
    const result = shallow(<Link decoratedText="http://localhost:8000" />);
    expect(result).to.have.prop('href').to.contain('http://localhost:8000');
  });

  it('generates mailto href when supplied with email', () => {
    const result = shallow(<Link decoratedText="name@example.com" />);
    expect(result).to.have.prop('href').to.contain('mailto:name@example.com');
  });

  it('uses _self as the default target value', () => {
    const result = shallow(<Link />);
    expect(result).to.have.prop('target').to.contain('_self');
  });

  it('applies custom target value', () => {
    // eslint-disable-next-line react/jsx-no-target-blank
    const result = shallow(<Link target="_blank" />);
    expect(result).to.have.prop('target').to.contain('_blank');
  });
});
