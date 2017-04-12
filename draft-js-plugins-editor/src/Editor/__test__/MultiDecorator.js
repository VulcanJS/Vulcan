import Draft from 'draft-js';
import { expect } from 'chai';
import MultiDecorator from '../MultiDecorator';

describe('MultiDecorator', () => {
  const contentBlock = new Draft.ContentBlock({
    text: 'AAA BBB CCC ABC'
  });

  const firstDecorator = new Draft.CompositeDecorator([
    {
      strategy(block, callback) {
        callback(0, 3);
        callback(12, 15);
      },
      component: () => 'a'
    }
  ]);

  const secondDecorator = new Draft.CompositeDecorator([
    {
      strategy(block, callback) {
        callback(4, 7);
        callback(12, 15);
      },
      component: () => 'b'
    }
  ]);

  const thirdDecorator = new Draft.CompositeDecorator([
    {
      strategy(block, callback) {
        callback(8, 11);
        callback(12, 15);
      },
      component: () => 'c'
    }
  ]);

  const decorator = new MultiDecorator([
    firstDecorator,
    secondDecorator,
    thirdDecorator
  ]);

  it('should correctly decorate text', () => {
    const out = decorator.getDecorations(contentBlock);

    expect(out.toJS()).to.deep.equal([
      '0-0.0',
      '0-0.0',
      '0-0.0',
      null,
      '1-0.0',
      '1-0.0',
      '1-0.0',
      null,
      '2-0.0',
      '2-0.0',
      '2-0.0',
      null,
      '2-0.1',
      '2-0.1',
      '2-0.1'
    ]);
  });

  it('should correctly resolve component', () => {
    let fn = decorator.getComponentForKey('0-0.0');
    expect(fn()).to.equal('a');

    fn = decorator.getComponentForKey('1-0.0');
    expect(fn()).to.equal('b');
  });
});
