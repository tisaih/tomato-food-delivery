const db = require('../../../config/db');

exports.find = async () => {
  const restaurants = await db.from('restaurants').select('*');
  return restaurants;
}

exports.findById = async (id) => {
  const restaurants = await db
    .from({ r: 'restaurants' })
    .leftJoin({ m: 'meals' }, 'r.id', 'm.restaurant_id')
    .select(
      'r.id', 'r.name', 'r.type',
      { 
        meal_id: 'm.id',
        meal_name: 'm.name',
        meal_description: 'm.description',
        meal_price: 'm.price',
      })
    .where({ 'r.id': id });

  if (!restaurants.length) return null;

  return restaurants.reduce((restaurant, rm) => ({
    id: rm.id,
    name: rm.name,
    type: rm.type,
    meals: [ 
      ...restaurant.meals,
      ...(rm.meal_id 
        ? [{ 
            id: rm.meal_id,
            name: rm.meal_name,
            description: rm.meal_description,
            price: Number(rm.meal_price)
          }] 
        : [])
    ]
  }), { meals: [] });
}

exports.create = async (restaurant) => {
  let restaurantId = null;

  await db.transaction(async trx => {
    const { name, type, description } = restaurant;

    const restaurantIds = await trx('restaurants')
      .insert({ name, type, description }, 'id');
      
    restaurantId = restaurantIds[0];

    if (restaurant.meals && restaurant.meals.length) {
      const meals = restaurant.meals.map(meal => ({ ...meal, restaurant_id: restaurantId }));
      await trx('meals').insert(meals, 'id');
    }
  });

  const meals = await db
    .select('*')
    .from('meals')
    .where('restaurant_id', restaurantId);

  return {
    id: restaurantId,
    ...restaurant,
    meals: meals.map(meal => ({ 
      id: meal.id,
      name: meal.name,
      price: Number(meal.price),
      description: meal.description 
    }))
  }
}

exports.update = async (restaurant) => {
  await db.transaction(async trx => {
    const { meals } = restaurant;
    delete restaurant.meals;
    
    try {
      await trx('restaurants').update(restaurant).where('id', restaurant.id);
  
      let updateTasks = [];
      if (meals && meals.length) {
        updateTasks = meals.map(meal => trx('meals').update(meal).where('id', meal.id));
      }

      await Promise.all(updateTasks)
    } finally {
      restaurant.meals = meals;
    }
  })
}

exports.remove = async (id) => {
  await db('restaurants').where({ id }).del()
}