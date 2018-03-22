'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable("users", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    provider: {
      type: type.STRING
    },
    provider_id: {
      type: type.STRING
    },
    display_name: {
      type: type.STRING
    },
    name: {
      type: type.STRING
    }
  });
};

exports.down = function(db) {
  return db.dropTable("users");
};

exports._meta = {
  "version": 1
};
