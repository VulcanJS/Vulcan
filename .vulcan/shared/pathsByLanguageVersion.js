/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Files that are transformed and can use ES6/Flow/JSX.
const esNextPaths = [
  // Internal forwarding modules
  'packages/*/*.js',
  'packages/*/*.jsx',
];

module.exports = {
  esNextPaths,
};