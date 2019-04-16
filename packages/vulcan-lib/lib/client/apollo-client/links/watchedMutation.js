/**
 * Watched mutations allow to update the cache based on a MutationSuccess
 * E.g. if the user juste created a Todo, we can update the cached Todo list
 * @see https://github.com/haytko/apollo-link-watched-mutation
 */
import WatchedMutationLink from 'apollo-link-watched-mutation';
import { WatchedMutations } from '../updates';
import cache from '../cache';
const watchedMutationLink = new WatchedMutationLink(cache, WatchedMutations);

export default watchedMutationLink;
