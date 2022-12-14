const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ msg: "Accès refusé" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Accès refusé" });
  }
};
