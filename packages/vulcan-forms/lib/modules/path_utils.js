import toPath from 'lodash/toPath';
import initial from 'lodash/initial';
import flow from 'lodash/fp/flow';
import takeRight from 'lodash/takeRight';

/**
 * Splits a path in string format into an array.
 *
 * @param {String} string
 *  Path in string format
 * @return {[string|number]}
 */
export const splitPath = string => toPath(string);

/**
 * Joins a path in array format into a string.
 *
 * @param {[string|number]} array
 *  Path in array format
 * @return {String}
 */
export const joinPath = array =>
  array.reduce(
    (string, item) =>
      string + (
        Number.isNaN(Number(item))
          ? `${string === '' ? '' : '.'}${item}`
          : `[${item}]`
      ),
    '',
  );

/**
 * Retrieves parent path from the given one.
 *
 * @param {String} string
 *  Path in string format
 * @return {String}
 */
export const getParentPath = flow(splitPath, initial, joinPath);

/**
 * Removes prefix from the given paths.
 *
 * @param {String} prefix
 * @param {String[]} paths
 * @return {String[]}
 */
export const removePrefix = (prefix, paths) => {
  const explodedPrefix = splitPath(prefix);
  return paths.map(path => {
    if (path === prefix) {
      return path;
    }
    const explodedPath = splitPath(path);
    const explodedSuffix = takeRight(
      explodedPath,
      explodedPath.length - explodedPrefix.length,
    );
    return joinPath(explodedSuffix);
  });
};

/**
 * Filters paths that have the given prefix.
 *
 * @param {String} prefix
 * @param {String[]} paths
 * @return {String[]}
 */
export const filterPathsByPrefix = (prefix, paths) =>
  paths.filter(path => (
    path === prefix ||
    path.startsWith(`${prefix}.`) ||
    path.startsWith(`${prefix}[`)
  ));
