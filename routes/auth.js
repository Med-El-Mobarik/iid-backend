const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { Sequelize } = require("sequelize");

router.post("/login", async (req, res) => {
  let user;

  try {
    const existUser = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("username")),
        Sequelize.fn("lower", req.body.username)
      ),
    });

    if (existUser) {
      user = existUser;
    } else {
      return res.status(404).json({ msg: "User n'existe pas" });
    }

    if (user.password.toLowerCase() == req.body.password.toLowerCase()) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.TOKEN_SECRET
      );
      return res.json({
        name: user.name,
        role: user.role,
        token: token,
      });
    } else {
      return res.status(400).json({ msg: "Mot de passe incorrect" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erreur serveur réessayer plus tard" });
  }
});

module.exports = router;
