import { expect } from 'chai';
import getTypeByTrigger from '../getTypeByTrigger';

describe('getTypeByTrigger', () => {
  it('returns "mention" for trigger "@"', () => {
    expect(getTypeByTrigger('@')).to.equal('mention');
  });

  it('returns ":mention" for trigger ":"', () => {
    expect(getTypeByTrigger(':')).to.equal(':mention');
  });

  it('returns "-mention" for trigger "-"', () => {
    expect(getTypeByTrigger('-')).to.equal('-mention');
  });
});
