const express = require("express");
const Router = express.Router();
const { message } = require("../models/message");

Router.post("/saveMessage", async function(req, res) {
  console.log(req.body);
  // if(!message.validate(req.body)) {

  // }
  const messageDoc = message(req.body);
  try {
    const result = await messageDoc.save();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.put("/updateMessage/:id", async function(req, res) {
  try {
    console.log(req.body);
    console.log("UPDATE");
    const id = req.params.id;
    console.log(id);
    const result = await message.findOneAndUpdate({ _id: id }, req.body);
    res.send(result);
    console.log(result);
  } catch (ex) {
    console.log("OUT");
    res.send(ex.message);
  }

  // console.log(req.body);
  // const messageDoc = message(req.body);
  // try {
  //   const result = await messageDoc.save();
  //   res.send(result);
  // } catch (ex) {
  //   res.send(ex.message);
  // }
});

Router.get("/getAllMessages", async function(req, res) {
  try {
    const result = await message.find();
    console.log("getALLUSERS");
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

// Delete a Customer with Id
Router.delete("/delete/:id", async function(req, res) {
  try {
    console.log("IN");
    const id = req.params.id;
    console.log(id);
    const result = await message.remove({ _id: id });
    res.send(result);
  } catch (ex) {
    console.log("OUT");
    res.send(ex.message);
  }
});

module.exports = Router;
