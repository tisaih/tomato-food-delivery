const OrderRepository = require("./order.repository");
const StateMachine = require("javascript-state-machine");

function createStateMachine(order) {
  return new StateMachine({
    init: order.status,
    transitions: [
      { name: "cancelled", from: "placed", to: "cancelled" },
      { name: "processing", from: "placed", to: "processing" },
      { name: "in_route", from: "processing", to: "in_route" },
      { name: "delivered", from: "in_route", to: "delivered" },
      { name: "received", from: "delivered", to: "received" }
    ]
  });
}

function applyOrderDiscount(order) {
  let { total_amount: subtotal = 0, total_discount = 0 } = order;
  
  if (subtotal > 250 && subtotal <= 500) {
    total_discount = 0.05;
  } else if (subtotal > 500 && subtotal <= 700) {
    total_discount = 0.08;
  } else if (subtotal > 700) {
    total_discount = 0.10;
  }
  
  const total_discount_value = subtotal * total_discount;
  const total_amount = subtotal - total_discount_value;

  return {
    ...order,
    subtotal,
    total_discount,
    total_amount
  }
}

function handleError(res, err) {
  return res.send(500, err);
}

// Get list of orders
exports.index = async function(req, res) {
  try {
    const orders = await OrderRepository.find();
    return res.json(200, orders);
  } catch (err) {
    return handleError(res, err);
  }
};

// Get list of restaurant orders
exports.restaurant_index = async function(req, res) {
  try {
    orders = await OrderRepository.find({ restaurant_id: req.params.id || req.user.id });
    return res.json(200, orders);
  } catch (err) {
    return handleError(res, err);
  }
};

// Get a single order
exports.show = async function(req, res) {
  try {
    const order = await OrderRepository.findById(req.params.id);
    if (!order) {
      return res.send(404);
    }
    return res.json(200, order);
  } catch (err) {
    return handleError(res, err);
  }
};

// Create a order
exports.create = async function(req, res) {
  try {
    let order = applyOrderDiscount({ ...(req.body || {}), /* user_id: req.user.id */ });
    order = await OrderRepository.create(order);
    return res.json(201, order);
  } catch (err) {
    return handleError(res, err);
  }
};

// Updates an existing order in the DB.
exports.update = async function(req, res) {
  try {
    const existingOrder = await OrderRepository.findById(req.params.id);
    if (!existingOrder) {
      return res.send(404);
    }

    const order = req.body;

    const fsm = createStateMachine(existingOrder);
    if (fsm.cannot(order.status)) {
      return res.status(403).json({
        status: `Not a valid transition from ${existingOrder.status} to ${order.status}.`
      });
    }

    await OrderRepository.update(order);

    return res.json(200, order);
  } catch (err) {
    return handleError(res, err);
  }
};

// Deletes a order from the DB
exports.destroy = async function(req, res) {
  try {
    const existingOrder = await OrderRepository.findById(req.params.id);
    if (!existingOrder) {
      return res.send(404);
    }
    await OrderRepository.remove(req.params.id);

    return res.json(200);
  } catch (err) {
    return handleError(res, err);
  }
};
