const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");

// Load input validation
const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");

// Load User model
const UserRepository = require("./user.repository");

function handleError(res, err) {
  return res.send(500, err);
}

exports.registerUser = async (req, res) => {
  try {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const { password, role, email, name } = req.body;
    let newUser = { name, email, password, role };

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ email: "Email already exists" });
    }

    // Hash password before saving in database
    bcrypt.genSalt(10, (_, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;

        newUser.password = hash;
        newUser = await UserRepository.create(newUser);
        return res.json(newUser);
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.loginUser = async (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  const user = await UserRepository.findByEmail(email);
  // Check if user exists
  if (!user) {
    return res.status(404).json({ emailnotfound: "Email not found" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // User matched
    // Create JWT Payload
    const payload = { id: user.id, name: user.name };

    // Sign token
    jwt.sign(payload, keys.secretOrKey,
      { 
        expiresIn: 31556926 // 1 year in seconds
      },
      (_, token) => {
        res.json({ success: true, token: `Bearer ${token}` });
      }
    );
  } else {
    return res.status(400).json({ passwordincorrect: "Password incorrect" });
  }
};

// Get a single user
exports.show = async function(req, res) {
  try {
    const user = await UserRepository.findById(req.params.id || req.user.id);
    if (!user) {
      return res.send(404);
    }
    return res.json(200, user);
  } catch (err) {
    return handleError(res, err);
  }
};
