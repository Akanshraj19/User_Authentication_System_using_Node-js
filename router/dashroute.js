const express = require("express");
const router = express.Router();
const dashModel = require("../models/dashSch");
const verifyToken = require("../middlewares/authMiddleware.js");
const { default: mongoose } = require("mongoose");
const controller = require("../controller/userController.js");

// router.put('/addDash',verifyToken,controller.insertData);
// router.post('/updDash',verifyToken,controller.updateData);
// router.get('/getDash',verifyToken,controller.findData);
// router.delete('/delDash',verifyToken,controller.deleteData);

// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new item
router.post("/create", verifyToken, async (req, res) => {
  const { title, description, price, Quantity } = req.body;
  try {
    const newItem = new dashModel({ title, description, price, Quantity });
    const item = await newItem.save();
    res.json(item);
  } catch (error) {
    res.status(500).send("server error");
  }
});

// Read all items
router.get("/read", verifyToken, async (req, res) => {
  try {
    const items = await dashModel.find({});
    res.json(items);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Find an item by ID
router.get("/FindDash", verifyToken, async (req, res) => {
  try {
    let item_data = {};
    if (req.body.title) item_data = { title: req.body.title };
    const item = await dashModel.find(item_data);

    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Update an item  by ID
router.put("/UpdDash/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, price, Quantity } = req.body;
  try {
    const item = await dashModel
      .findByIdAndUpdate(
        id,
        {
          title,
          description,
          price,
          Quantity,
        },
        { new: true }
      )
      .lean();
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete an item by ID
router.delete("/Deletedash/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await dashModel.findById(id);

    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    await dashModel.deleteOne({ _id: id });
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});


module.exports = router;
