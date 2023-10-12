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
    db.runSql("ALTER DATABASE db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;")
    return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
