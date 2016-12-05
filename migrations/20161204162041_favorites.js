'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table) {
    table.increments(),
    table.integer('book_id').notNullable().references('books.id').onDelete('CASCADE').index(),
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index(),
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('favorites');
};
