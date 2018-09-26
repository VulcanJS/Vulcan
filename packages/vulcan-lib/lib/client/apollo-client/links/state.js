/**
 * Setup apollo-link-state
 * Apollo-link-state helps to manage a local store for caching and client-side
 * data storing
 * It replaces previous implementation using redux
 * Link state doc:
 * @see https://www.apollographql.com/docs/react/essentials/local-state.html
 * @see https://www.apollographql.com/docs/link/links/state.html
 * General presentation on Links
 * @see https://www.apollographql.com/docs/link/
 * Example
 * @see https://hackernoon.com/storing-local-state-in-react-with-apollo-link-state-738f6ca45569
 */
import { withClientState } from 'apollo-link-state';
import cache from '../cache';
import { getDefaultResolvers } from '../../../../../vulcan-core/lib/client/main';

/**
 * Create a state link
 * We allow to load an existing cache
 */
const createStateLink = ({ cache: providedCache = cache, resolvers, defaults }) => {
  const stateLink = withClientState({
    cache: providedCache,
    defaults,
    resolvers
  });
  return stateLink;
};
const initialStateLink = createStateLink();

let stateLink = initialStateLink;
export const getStateLink = () => stateLink;

export const reloadStateLink = ({ cache: providedCache }) => {
  const newStateLink = createStateLink({
    cache: providedCache,
    defaults: getDefaults(),
    resolvers: getResolvers()
  });
  stateLink = newStateLink;
  return newStateLink;
};
// TODO: need to find the equivalent of "replaceReducer" for the apolloClient or
// the stateLink
//@see https://github.com/apollographql/apollo-link-state/issues/306

// enhancement workflow
const registeredDefaults = {};
/**
 * Defaults are default response to queries
 */
export const addDefault = ({ name, defaultValue, options = {} }) => {
  registeredDefaults[name] = defaultValue;
  return registeredDefaults;
};
export const getDefaults = () => registeredDefaults;

// Mutation are equivalent to a Redux Action + Reducer
// except it uses GraphQL
const registeredMutations = {};
export const addMutation = ({ name, mutation, options = {} }) => {
  registeredMutations[name] = mutation;
  return registeredMutations;
};
export const getMutations = () => registeredMutations;
// Queries are equivalent to Redux concept of selector
// except it uses GraphQL
const registeredQueries = {};
export const addQuery = ({ name, query, options = {} }) => {
  registeredQueries[name] = query;
  return registeredQueries;
};
export const getQueries = () => registeredQueries;

export const getResolvers = () => ({
  Mutation: getMutations(),
  Query: getQueries()
});

export default createStateLink({});
