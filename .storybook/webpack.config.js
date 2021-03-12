/*

Webpack setup

Adapt with your own loaders and config if necessary

*/

const path = require('path');
const webpack = require('webpack');

// Find Vulcan install, should not be modified

/**
 * Smart function to find Vulcan packages
 *
 * You can either provide a path to Vulcan as VULCAN_DIR env
 * or set the METEOR_PACKAGE_DIR variable
 */
const findPathToVulcanPackages = () => {
  // look for VULCAN_DIR env variable
  if (process.env.VULCAN_DIR) return `${process.env.VULCAN_DIR}/packages`;
  // look for METEOR_PACKAGE_DIRS variable
  const rawPackageDirs = process.env.METEOR_PACKAGE_DIRS;
  if (rawPackageDirs) {
    const dirs = rawPackageDirs.split(':');
    // Vulcan dir should be '/some-folder/Vulcan/packages'
    const vulcanPackagesDir = dirs.find(dir => !!dir.match(/\/Vulcan\//));
    if (vulcanPackagesDir) {
      return vulcanPackagesDir;
    }
    console.log(`
      Please either set the VULCAN_DIR variable to your Vulcan folder or
      set METEOR_PACKAGE_DIRS to your <Vulcan>/packages folder.
      Fallback to default value: '../../Vulcan'.`);
  }
  // default value
  return '../../Vulcan/packages';
};
// path to your Vulcan repo (see 2-repo install in docs)
const pathToVulcanPackages = path.resolve(__dirname, findPathToVulcanPackages());

module.exports = ({ config }) => {
  // Define aliases. Allow to mock some packages.
  config.resolve = {
    ...config.resolve,
    // this way node_modules are always those of current project and not of Vulcan
    alias: {
      ...config.resolve.alias,
      // Vulcan Packages
      'meteor/vulcan:email': path.resolve(__dirname, './mocks/vulcan-email'),
      //'meteor/vulcan:i18n': 'react-intl',
      // Other packages
      'meteor/apollo': path.resolve(__dirname, './mocks/meteor-apollo'),
      'meteor/server-render': path.resolve(__dirname, './mocks/meteor-server-render'),
    },
  };
  // Mock global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      // mock global variables
      Meteor: path.resolve(__dirname, './mocks/Meteor'),
      Vulcan: path.resolve(__dirname, './mocks/Vulcan'),
      Mongo: path.resolve(__dirname, './mocks/Mongo'),
      _: 'underscore',
    })
  );

  // force the config to use local node_modules instead the modules from Vulcan install
  // Should not be modified
  config.resolve.modules.push(path.resolve(__dirname, '../node_modules'));

  // handle meteor packages
  // Add your custom loaders here if necessary
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loaders: [
      // Remove meteor package (last step)
      {
        loader: 'scrap-meteor-loader',
        options: {
          // those package will be preserved, we provide a mock instead
          preserve: ['meteor/apollo', 'meteor/vulcan:email', 'meteor/server-render'],
        },
      },
      // Load Vulcan core packages
      {
        loader: 'vulcan-loader',
        options: {
          vulcanPackagesDir: pathToVulcanPackages,
          environment: 'client',
          // those package are mocked using an alias instead or just ignored
          exclude: ['meteor/vulcan:email', 'meteor/vulcan:accounts'],
        },
      },
      // Add your loaders here for your own local vulcan-packages
      // Example for Vulcan Starter:
      {
        loader: path.resolve(__dirname, './loaders/starter-example-loader'),
        options: {
          packagesDir: path.resolve(__dirname, '../packages'),
          environment: 'client',
        },
      },
    ],
  });

  // Parse JSX files outside of Storybook directory
  // Should not be modified
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: [
            '@babel/react',
            {
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
              ],
            },
          ],
        },
      },
    ],
  });

  // Parse SCSS files
  // Should not be modfied
  config.module.rules.push({
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
    // include: path.resolve(__dirname, "../")
  });

  // Return the altered config
  return config;
};
