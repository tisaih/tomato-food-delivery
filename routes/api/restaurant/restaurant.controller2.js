const RestaurantRepository = require("./restaurant.repository");

function handleError(res, err) {
  return res.send(500, err);
}

// Get list of restaurants
exports.index = async function(req, res) {
  try {
    const restaurants = await RestaurantRepository.find();
    return res.json(200, restaurants);
  } catch (err) {
    return handleError(res, err);
  }
};

// Get a single restaurant
exports.show = async function(req, res) {
  try {
    const restaurant = await RestaurantRepository.findById(req.params.id);
    if (!restaurant) {
      return res.send(404);
    }
    return res.json(200, restaurant);
  } catch (err) {
    return handleError(res, err);
  }
};

// Create a restaurant
exports.create = async function(req, res) {
  try {
    const restaurant = await RestaurantRepository.create(req.body);
    return res.json(201, restaurant);
  } catch (err) {
    return handleError(res, err);
  }
};

// Updates an existing restaurant in the DB.
exports.update = async function(req, res) {
  try {
    const existingRestaurant = await RestaurantRepository.findById(req.params.id);
    if (!existingRestaurant) {
      return res.send(404);
    }

    const restaurant = req.body;
    await RestaurantRepository.update(restaurant);

    return res.json(200, restaurant);
  } catch (err) {
    return handleError(res, err);
  }
};

// Deletes a restaurant from the DB.
exports.destroy = async function(req, res) {
  try {
    const existingRestaurant = await RestaurantRepository.findById(req.params.id);
    if (!existingRestaurant) {
      return res.send(404);
    }
    await RestaurantRepository.remove(req.params.id);

    return res.json(200);
  } catch (err) {
    return handleError(res, err);
  }
};
