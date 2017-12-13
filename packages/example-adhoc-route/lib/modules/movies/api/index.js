/* jshint indent: 2 */
import { modelName, model } from './model';

let ormCollection = null;
if ( Meteor.isServer ) {

  import { sequelize as sqlz } from '../../db_connectors';
  ormCollection = sqlz.import(modelName.l, model);
  ormCollection.sync();

}

export { modelName, model, ormCollection };
