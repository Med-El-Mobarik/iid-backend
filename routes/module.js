const router = require("express").Router();
const auth = require("../middlewares/auth");
const Module = require("../models/module");
// const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role == "etudiant" || req.user.role == "admin") {
      const modules = await Module.findAll();
      return res.send(modules);
    } else if (req.user.role == "prof") {
      const modules = await Module.findAll({
        where: {
          UserId: req.user.id,
        },
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

module.exports = router;
