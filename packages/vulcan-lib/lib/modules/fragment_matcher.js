import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

export const FragmentMatcher = [];

export const addToFragmentMatcher = fragmentMatcher => {
  FragmentMatcher.push(fragmentMatcher);
}

export const getFragmentMatcher = () => {
  const fm = {
    introspectionQueryResultData: {
      __schema: {
        types: FragmentMatcher,
      },
    }
  };
  return new IntrospectionFragmentMatcher(fm);
}
