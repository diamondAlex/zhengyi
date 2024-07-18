'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {

    db.createTable('sessions', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        sessionid: { type: 'string' },
        username: 'string'
    });
    return null;
};

exports.down = function(db) {
    db.dropTable("sessions")
    return null;
};

exports._meta = {
  "version": 1
};
