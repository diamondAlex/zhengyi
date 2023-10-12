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
    db.createTable('profiles', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        userId: { 
            type: 'int', 
            foreignKey: {
                name:"user_profile_id",
                table:"users",
                rules:{
                    onDelete:"CASCADE",
                },
                mapping:'id'
            },
            notNull:true
        },
        username: {type: 'string', unique:true},
        fullname: {type: 'string'},
        bio: {type:"text"},
        timestamp: { type:'timestamp', 
                    defaultValue: new String('CURRENT_TIMESTAMP')
        },
    });


    return null;
};

exports.down = function(db) {
    db.dropTable("profiles")
    return null;
};

exports._meta = {
  "version": 1
};
