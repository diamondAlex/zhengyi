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
    db.createTable('articles', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        articleId: { type: 'int' },
        author: 'string',
        title: 'string',
        date: 'date',
        text: 'text'
    });
    return null;
};

exports.down = function(db) {
    db.dropTable("articles")
    return null;
};

exports._meta = {
  "version": 1
};
