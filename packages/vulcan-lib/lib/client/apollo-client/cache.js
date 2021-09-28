import { InMemoryCache } from '@apollo/client';
import { getFragmentMatcher } from '../../modules/fragment_matcher';

const createCache = () => new InMemoryCache({ fragmentMatcher: getFragmentMatcher() })
  //ssr
  .restore(window.__APOLLO_STATE__);

export default createCache;
