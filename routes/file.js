const auth = require("../middlewares/auth");
const File = require("../models/file");
const router = require("express").Router();

router.post("/", auth, async (req, res) => {
  if (req.user.role !== "prof") {
    res.status(401).json({ msg: "Vous n'etes pas un prof" });
  } else {
    try {
      const { name, type, ModuleId } = req.body;
      const file = await File.create({ name, type, ModuleId });
      return res.send(file);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const files = await File.findAll({
      where: {
        ModuleId: req.query.id,
      },
    });
    res.send(files);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/", auth, async (req, res) => {
  if (req.user.role !== "prof") {
    res.status(401).json({ msg: "Vous n'etes pas un prof" });
  } else {
    try {
      await File.destroy({
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

module.exports = router;
