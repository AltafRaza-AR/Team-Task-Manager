const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Grab the token from the header
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  // 2. Format the token (remove "Bearer " from the string)
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This attaches the userId and role to the request
    next(); // Let them pass!
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
