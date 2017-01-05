module.exports = {
  appName: 'production',
  servers: {
    one: {
      host: '198.199.111.153',
      username: 'discordius',
      //pem: 'Users/Discordius/.ssh/Telescope', // mup doesn't support '~' alias for home directory
      password: 'Your-Password-Here',
      // or leave blank to authenticate using ssh-agent
      // opts: {
      //    port: 8000,
      // },
    }
  },

  meteor: {
    name: 'Telescope',
    path: '../', // mup doesn't support '~' alias for home directory
    port: 80, // useful when deploying multiple instances (optional)
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
      PORT: 80,
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