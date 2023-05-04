
exports.up = function(knex) {
  return knex.schema.createTable('restaurants', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('name').notNull()
    table.string('type').notNull()
    table.string('description').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('restaurants')
};
