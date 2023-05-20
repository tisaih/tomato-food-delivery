const db = require('../../../config/db');

exports.findById = async (id) => {
  const user = await db
    .from('users')
    .select('*')
    .where('id', id)
    .first();

  return user;
}

exports.findByEmail = async (email) => {
  const user = await db
    .from('users')
    .select('*')
    .where('email', email)
    .first();

  return user;
}


exports.create = async (user) => {
  const ids = await db('users').insert(user, 'id');

  return { id: ids[0], ...user };
}