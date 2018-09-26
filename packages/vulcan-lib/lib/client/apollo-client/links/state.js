/**
 * Setup apollo-link-state
 * Apollo-link-state helps to manage a local store for caching and client-side 
 * data storing
 * It replaces previous implementation using redux
 * Link state doc:
 * @see https://www.apollographql.com/docs/link/links/state.html
 * General presentation on Links
 * @see https://www.apollographql.com/docs/link/
 * Example
 * @see https://hackernoon.com/storing-local-state-in-react-with-apollo-link-state-738f6ca45569
 */
import { withClientState } from 'apollo-link-state'
import cache from '../cache'

const createStateLink = ({ resolvers, defaults }) => {
    const stateLink = withClientState({
        cache,
        defaults,
        resolvers,
    })
    return stateLink
}

export default createStateLink({})

