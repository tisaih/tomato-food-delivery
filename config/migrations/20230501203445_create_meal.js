exports.up = function(knex) {
  return knex.schema.createTable('meals', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('restaurant_id').references('id').inTable('restaurants').notNull().onDelete('CASCADE')
    table.string('name').notNull()
    table.decimal('price').notNull()
    table.string('description').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('meals')
};
