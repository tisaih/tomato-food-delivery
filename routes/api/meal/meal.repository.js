const db = require('../../../config/db');

exports.find = async () => {
  const meals = await db
    .from('meals')
    .select('*');

  return meals;
}

exports.findById = async (id) => {
  const meal = await db
    .from('meals')
    .select('*')
    .where('id', id )
    .first();

  return meal;
}

exports.create = async (meal) => {
  const ids = await db('meals').insert(meal, 'id');

  return { id: ids[0], ...meal };
}

exports.update = async (meal) => {
  await db('meals').update(meal).where('id', meal.id);
}

exports.remove = async (id) => {
  await db('meals').where({ id }).del()
}