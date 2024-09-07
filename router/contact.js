const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
dotenv.config();
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/authMiddleware.js");
const controller = require("../controller/userController.js");
const contactModel = require("../models/contact.js");
// const { default: mongoose } = require("mongoose");

router.put("/addDoc", verifyToken, controller.insertData);
router.post("/updDoc", verifyToken, controller.updateData);
router.get("/getEntry", verifyToken, controller.findData);
router.delete("/delEntry", verifyToken, controller.deleteData);

router.post("/signup", async (req, res) => {
  try {
    const { username, password ,email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const contact = new contactModel({ username, email, password: hashedPassword });
    await contact.save(200);
    res.status(201).json({message: 'Registration successful'});
    // res.status(201).render("login");
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Registration failed'});
    // res.status(500).render("login");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const result = await contactModel.findOne({ username }).lean().exec();
    if (!result) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordM = await bcrypt.compare(password, result.password);

    if (!passwordM) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign(
      { userId: process.env.JWTtoken_user  },
      process.env.JWTtoken_pass,
      {
        expiresIn: "30min",
      }
    );
    res.cookie("jwt", token, { httpOnly: true });
    // res.json({username});
    res.render("dashboard", { username });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

//To Find the data by PhoneNo
router.get("/find", verifyToken, async (req, res) => {
  try {
    console.log(req.query.un);
    const result = await contactModel.findOne({ username: req.query.un });
    res.json({ message: result });
  } catch (error) {
    console.log({ message: error });
  }
});

// To update the data
router.put("/update",verifyToken, async (req, res) => {
  try {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await contactModel.updateOne(
      { username : username},
      { $set: {password: hashedPassword }}
      // { password: password },
      // { $set: { username: username } }
    );
    res.json({ message: result });
  } catch (error) {
    console.log({ message: error });
  }
});

// To delete the data
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    const result = await contactModel.deleteOne({ username: username });
    res.json({ message: result });
  } catch (error) {
    console.log({ message: error });
  }
});
router.post("/forget_password", controller.forgotpassword);
router.post("/reset_password", controller.resetPassword);
router.get("/forget_password", controller.getForgetPassword);
router.get("/reset_password/:id", controller.getResetPassword);


module.exports = router;
