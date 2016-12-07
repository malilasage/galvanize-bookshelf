'use strict'
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments(),
    table.string('first_name').notNullable().defaultTo(''),
    table.string('last_name').notNullable().defaultTo(''),
    table.string('email').notNullable().unique('email'),
    table.specificType('hashed_password', 'char(60)').notNullable(),
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};