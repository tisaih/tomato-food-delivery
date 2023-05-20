
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('name').notNull()
    table.string('email').notNull()
    table.string('password').notNull()
    table.string('role').notNull().defaultTo('user')
    table.datetime('date').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
