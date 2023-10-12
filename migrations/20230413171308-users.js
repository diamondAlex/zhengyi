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
    db.createTable('users', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        username: {type: 'string', unique:true},
        password: 'string',
        admin: {type:'int', notNull: true, defaultValue: 0},
        timestamp: { type:'timestamp', 
                    defaultValue: new String('CURRENT_TIMESTAMP')
        },
    });

    return null;
};

exports.down = function(db) {
    db.dropTable("users")
    return null;
};

exports._meta = {
  "version": 1
};
