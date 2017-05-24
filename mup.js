module.exports = {
  appName: 'development',
  servers: {
    one: {
      host: '198.199.111.153',
      username: 'discordius',
      //pem: 'Users/Discordius/.ssh/Telescope', // mup doesn't support '~' alias for home directory
      password: '6fpfghyLnVIP',
      // or leave blank to authenticate using ssh-agent
      // opts: {
      //     port: 80,
      // },
    }
  },

  meteor: {
    name: 'Telescope-development',
    path: '../', // mup doesn't support '~' alias for home directory
    port: 82, // useful when deploying multiple instances (optional)
    docker: {
      image: 'abernix/meteord:base', // use this image if using Meteor 1.4+
    },
    servers: {
      one: {}, two: {}, three: {} // list of servers to deploy, from the 'servers' list
    },
    buildOptions: {
      serverOnly: true,
      debug: true,
      cleanAfterBuild: true, // default
      //buildLocation: '/LessWrong', // defaults to /tmp/<uuid>
    },
    env: {
      ROOT_URL: 'http://198.199.111.153',
      MONGO_URL: 'mongodb://localhost/meteor',
      PORT: 82,
    },
    deployCheckWaitTime: 120 // default 10
  },

   mongo: { // (optional)
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
