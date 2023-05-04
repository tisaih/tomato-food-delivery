exports.up = function(knex) {
  return knex.schema.createTable('order_meals', table => {
    table.uuid('order_id').references('id').inTable('orders').notNull()
    table.uuid('meal_id').references('id').inTable('meals').notNull()
    table.primary(['order_id', 'meal_id'])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('order_meals')
};