'use strict';

let Sequelize = null;
let sequelize = null;
let sanityCheck = null;

if ( Meteor.isServer ) {

  import Sequelize from 'sequelize';

  const LG = (msg) => console.log('Within %s...\n  |%s', module.id, msg);
  const MRK = (chr, cnt) => console.log(chr.repeat(cnt));

  const db = 'examples';
  const type = 'sqlite';
  sequelize = new Sequelize(
    db,
    null,
    null,
    {
      dialect: type,
      logging: false,
      // logging: true,
      storage: './adhoc-route-example.sqlite',
    },
  );

  sequelize.authenticate().then(function(err) {
      console.log(` Connection to '${type}' database '${db}' established successfully.`);
    }, function (err) {
      console.log(` Unable to connect to the database:`, err);
    }
  );

  // sanityCheck = (table, label, attribute, row) => {

  //   table.findAll().then(function (result) {
  //     console.log(' %s #%s -- %s', label, row + 1, result[row][attribute]); // eslint-disable-line no-console
  //   }).catch( (error) => {
  //     console.log('Sequelize error while finding sanity check item...', error); // eslint-disable-line no-console
  //   });

  // }

}


// export { Sequelize, sequelize, sanityCheck };
export { Sequelize, sequelize };
