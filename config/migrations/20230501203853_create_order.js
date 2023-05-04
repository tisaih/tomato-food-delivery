
exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('user_id').references('id').inTable('users').notNull()
    table.uuid('restaurant_id').references('id').inTable('restaurants').notNull()
    table.decimal('subtotal').notNull()
    table.decimal('total_discount').notNull()
    table.decimal('total_amount').notNull()
    table.string('status').notNull().defaultTo('placed')
    table.datetime('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders')
};
