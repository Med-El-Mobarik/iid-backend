const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const User = require("./models/user");
const File = require("./models/file");
const Module = require("./models/module");
const userRoute = require("./routes/auth");
const moduleRoute = require("./routes/module");
const fileRoute = require("./routes/file");

const dotenv = require("dotenv");
dotenv.config();

User.hasMany(Module);
Module.belongsTo(User);

Module.hasMany(File, { onDelete: "CASCADE" });
File.belongsTo(Module);

const app = express();

const Port = process.env.PORT || 8000;

const corsOptions = {
  exposedHeaders: "auth-token",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/module", moduleRoute);
app.use("/api/file", fileRoute);

app.listen(Port, async () => {
  console.log(`-- server running on port ${process.env.PORT} ... --`);
  try {
    await db.authenticate();
    console.log("-- Db connected --");
  } catch (error) {
    console.error("-- Db not connected --", error);
  }
  try {
    await db.sync();
    console.log("-- Tables were created successfully --");
  } catch (error) {
    console.log("-- Tables were not created --", error);
  }
});
