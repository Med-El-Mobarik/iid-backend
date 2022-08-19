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

module.exports = router;
