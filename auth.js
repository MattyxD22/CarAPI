const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token || typeof token === "undefined") {
    return res.status(401).json({ error: "Access denied!" });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = verifyToken;
