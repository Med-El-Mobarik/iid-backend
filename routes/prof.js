const router = require("express").Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ msg: "You are not an admin" });
  } else {
    try {
      const profs = await User.findAll({
        where: {
          role: "prof",
        },
      });
      res.send(profs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
});

router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ msg: "You are not admin" });
  } else {
    try {
      const { name, username, password } = req.body;
      const existUsername = await User.findOne({ where: { username } });
      if (existUsername) {
        return res
          .status(400)
          .json({ msg: "Ce nom d'utilisateur existe déjà" });
      }
      const prof = await User.create({
        name,
        username,
        password,
        role: "prof",
      });
      res.send(prof);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
});

router.delete("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ msg: "You are not an admin" });
  } else {
    try {
      await User.destroy({
        where: {
          id: req.query.id,
        },
      });
      res.send("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
});

router.put("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ msg: "You are not admin" });
  } else {
    try {
      const { name, username, password } = req.body;

      const oldProf = await User.findByPk(req.query.id);

      if (oldProf.username !== username) {
        const existUsername = await User.findOne({ where: { username } });
        if (existUsername) {
          return res
            .status(400)
            .json({ msg: "Ce nom d'utilisateur existe déjà" });
        }
      }

      await User.update(
        {
          name,
          username,
          password,
        },
        { where: { id: req.query.id } }
      );

      const prof = await User.findByPk(req.query.id);

      res.send(prof);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
});

module.exports = router;
