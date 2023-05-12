const db = require('../../../config/db');

exports.find = async (predicates) => {  
  let orderMealsQuery = db
    .from({ o: 'orders' })
    .join({ r: 'restaurants' }, 'o.restaurant_id', 'r.id')
    .leftJoin({ om: 'order_meals' }, 'o.id', 'om.order_id')
    .select(
      'o.id', 
      'o.user_id',
      {
        restaurant_id: 'r.id',
        restaurant_name: 'r.name',
        restaurant_description: 'r.description',
        restaurant_type: 'r.type'
      },
      'o.subtotal',
      'o.total_discount',
      'o.total_amount',
      'o.status',
      'o.created_at',
      'om.meal_id',
    )
    // .orderBy('o.created_at', 'desc')
    ;

  if (predicates && predicates.restaurant_id) {
    orderMealsQuery = orderMealsQuery.where('r.id', predicates.restaurant_id);
  }

  return orderMealsQuery.then(orderMeals => {
    const toStructuredOrders = (orderMeals) => {
      const orders = [];
      const orderMeal = orderMeals.pop();

      if (orderMeal) {
        const currentOrderMeals = [orderMeal, ...orderMeals.filter(om => om.id === orderMeal.id)];
        const order = currentOrderMeals.reduce((order, om) => ({
          id: om.id,
          user_id: om.user_id,
          restaurant: {
            id: om.restaurant_id,
            name: om.restaurant_name,
            description: om.restaurant_description,
            type: om.restaurant_type
          },
          subtotal: om.subtotal,
          total_discount: om.total_discount,
          total_amount: om.total_amount,
          status: om.status,
          created_at: om.created_at,
          meals: [ 
            ...order.meals,
            ...(om.meal_id
              ? [ om.meal_id ]
              //   ? [{ 
              //       id: om.meal_id,
              //       name: om.meal_name,
              //       description: om.meal_description,
              //       price: Number(om.meal_price)
              //     }] 
              : [])
          ]
        }), { meals: [] });

        orders.push(order);
        orderMeals = orderMeals.filter(om => om.id !== orderMeal.id);
      }

      if (orderMeals.length) 
        return [ ...orders, ...toStructuredOrders(orderMeals) ];

      return orders;
    }

    return toStructuredOrders(orderMeals);
  });
}

exports.findById = async (id) => {
  const orderMeals = await db
    .from({ o: 'orders' })
    .join({ r: 'restaurants' }, 'o.restaurant_id', 'r.id')
    .leftJoin({ om: 'order_meals' }, 'o.id', 'om.order_id')
    .select(
      'o.id', 
      'o.user_id',
      {
        restaurant_id: 'r.id',
        restaurant_name: 'r.name',
        restaurant_description: 'r.description',
        restaurant_type: 'r.type'
      },
      'o.subtotal',
      'o.total_discount',
      'o.total_amount',
      'o.status',
      'o.created_at',
      'om.meal_id',
    )
    .where('o.id', id);

  if (!orderMeals.length) return null;

  const order = orderMeals.reduce((order, om) => ({
    id: om.id,
    user_id: om.user_id,
    restaurant: {
      id: om.restaurant_id,
      name: om.restaurant_name,
      description: om.restaurant_description,
      type: om.restaurant_type
    },
    subtotal: om.subtotal,
    total_discount: om.total_discount,
    total_amount: om.total_amount,
    status: om.status,
    created_at: om.created_at,
    meals: [ 
      ...order.meals,
      ...(om.meal_id
        ? [ om.meal_id ]
        //   ? [{ 
        //       id: om.meal_id,
        //       name: om.meal_name,
        //       description: om.meal_description,
        //       price: Number(om.meal_price)
        //     }] 
        : [])
    ]
  }), { meals: [] });

  return order;
}

exports.create = async (order) => {
  let orderId = null;
  
  const { meals } = order;
  delete order.meals;

  try {
    await db.transaction(async trx => {
      const orderIds = await trx('orders').insert(order, 'id');
      orderId = orderIds[0];
  
      if (meals && meals.length) {
        const orderMeals = meals.map(mealId => ({ order_id: orderId, meal_id: mealId }));
        await trx('order_meals').insert(orderMeals);
      }
    });
  } finally {
    order.meals = meals || [];
  }

  return {
    id: orderId,
    ...order,
  }
}

exports.update = async (order) => {
  const { meals, restaurant } = order;
  
  delete order.meals;
  delete order.restaurant;

  try {
    await db.transaction(async trx => {
      await trx('orders').update({ ...order, restaurant_id: restaurant.id }).where('id', order.id);
      
      if (meals && meals.length) {
        const orderMeals = meals.map(mealId => ({ order_id: order.id, meal_id: mealId }));

        await trx('order_meals').where('order_id', order.id).del();
        await trx('order_meals').insert(orderMeals);
      }
    });
  } finally {
    order.restaurant = restaurant;
    order.meals = meals || [];
  }
}

exports.remove = async (id) => {
  await db('orders').where({ id }).del()
}