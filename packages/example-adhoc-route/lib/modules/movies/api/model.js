/* jshint indent: 2 */

import { sequelize as sqlz } from '../../db_connectors';

let modelName = { t: 'Movie' };
modelName.u = modelName.t.toUpperCase();
modelName.l = modelName.t.toLowerCase();

const model = (sqlz, DataTypes) => {

  return sqlz.define(modelName.l, {
    _id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    review: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    privateComments: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sqlz.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sqlz.literal('CURRENT_TIMESTAMP')
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    paranoid: true,
    tableName: modelName.l
  });
};

export { modelName, model };
