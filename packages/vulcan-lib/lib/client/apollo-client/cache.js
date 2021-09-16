import { InMemoryCache } from 'apollo-cache-inmemory';
import { getFragmentMatcher } from '../../modules/fragment_matcher';
import debug from 'debug';
const debugApollo = debug('vulcan:apollo');

const createCache = () => {
  debugApollo('Rehydrating cache with Apollo State:', window.__APOLLO_STATE__);
  return (
    new InMemoryCache({ fragmentMatcher: getFragmentMatcher() })
      //ssr
      .restore(window.__APOLLO_STATE__)
  );
};

export default createCache;
