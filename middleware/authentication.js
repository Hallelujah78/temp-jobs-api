const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user to job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

module.exports = authenticationMiddleware;
