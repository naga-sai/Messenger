const express = require("express");
const Router = express.Router();
const { user } = require("../models/user");

Router.post("/saveUser", async function (req, res) {
  const userDoc = user(req.body);

  try {
    const result = await userDoc.save();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.get("/getAllUsers", async function (req, res) {

  try {
    const result = await user.find();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = Router;
