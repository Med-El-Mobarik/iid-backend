const router = require("express").Router();
const auth = require("../middlewares/auth");
const Module = require("../models/module");
const File = require("../models/file");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role == "etudiant" || req.user.role == "admin") {
      const modules = await Module.findAll({
        include: [File, User],
      });
      return res.send(modules);
    } else if (req.user.role == "prof") {
      const modules = await Module.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [File, User],
      });
      return res.send(modules);
    } else {
      return res
        .status(400)
        .json({ msg: "Vous êtes ni etudiant ni prof ni admin" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(400).json({ msg: "You are not an admin" });
  } else {
    try {
      await Module.destroy({
        where: {
          id: req.query.id,
        },
      });
      res.send("success");
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error" });
    }
  }
});

router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(401).json({ msg: "You are not admin" });
  } else {
    try {
      const { name, annee, semestre, UserId } = req.body;

      const existModule = await Module.findOne({
        where: {
          name,
        },
      });

      if (existModule) {
        return res.status(400).json({ msg: "le nom du module existe déjà" });
      }

      const module = await Module.create({
        name: name,
        showname: name,
        annee,
        semestre,
        UserId,
      });

      const sendmodule = await Module.findByPk(module.dataValues.id, {
        include: User,
      });

      return res.send(sendmodule);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server Error" });
    }
  }
});

router.put("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(401).json({ msg: "You are not admin" });
  } else {
    try {
      const { showname, annee, semestre, UserId } = req.body;

      await Module.update(
        {
          showname,
          annee,
          semestre,
          UserId,
        },
        { where: { id: req.query.id } }
      );

      const module = await Module.findByPk(req.query.id, { include: User });

      return res.send(module);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server Error" });
    }
  }
});

module.exports = router;
