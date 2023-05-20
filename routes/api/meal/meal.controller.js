const MealRepository = require("./meal.repository");

function handleError(res, err) {
  return res.send(500, err);
}

// Get list of meals
exports.index = async function(req, res) {
  try {
    const meals = await MealRepository.find();
    return res.json(200, meals);
  } catch (err) {
    return handleError(res, err);
  }
};

// Get a single meal
exports.show = async function(req, res) {
  try {
    const meal = await MealRepository.findById(req.params.id);
    if (!meal) {
      return res.send(404);
    }
    return res.json(200, meal);
  } catch (err) {
    return handleError(res, err);
  }
};

// Creates a meal
exports.create = async function(req, res) {
  try {
    const meal = await MealRepository.create(req.body);
    return res.json(201, meal);
  } catch (err) {
    return handleError(res, err);
  }
};

// Updates an existing meal in the DB.
exports.update = async function(req, res) {
  try {
    const existingMeal = await MealRepository.findById(req.params.id);
    if (!existingMeal) {
      return res.send(404);
    }

    const meal = req.body;
    await MealRepository.update(meal);

    return res.json(200, meal);
  } catch (err) {
    return handleError(res, err);
  }
};

// Deletes a meal from the DB.
exports.destroy = async function(req, res) {
  try {
    const existingMeal = await MealRepository.findById(req.params.id);
    if (!existingMeal) {
      return res.send(404);
    }
    await MealRepository.remove(req.params.id);

    return res.json(200);
  } catch (err) {
    return handleError(res, err);
  }
};
