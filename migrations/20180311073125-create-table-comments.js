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
  return db.createTable("comments", {
    name: {
      type: type.STRING,
      primaryKey: true
    },
    json: {
      type: type.STRING
    }
  });
};

exports.down = function(db) {
  return db.dropTable("comments");
};

exports._meta = {
  "version": 1
};
