const CRUDservices = require("../services/crudServices.js");
const contactModel = require("../models/contact.js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt")
dotenv.config()

module.exports = {
  insertData: async (req, res) => {
    const user = await CRUDservices.insertData(req.body);
    if (user == 500) res.status(500).end();
    else res.status(200).json(user);
  },
  deleteData: async (req, res) => {
    const result = await CRUDservices.deleteData(req.body);
    if (result == 500) res.status(500).end();
    else if (result == null) res.status(400).end();
    else res.status(200).json(result);
  },
  updateData: async (req, res) => {
    const updated = await CRUDservices.updateData(req.body);
    if (updated == 500) res.status(500).end();
    else if (updated == null) res.status(400).end();
    else res.status(200).json(updated);
  },
  findData: async (req, res) => {
    const found = await CRUDservices.findData(req.body);
    if (found == 500) res.status(500).end();
    else if (found == null) res.status(400).end();
    else res.status(200).json(found);
  },
  getForgetPassword(req, res) {
    res.render("forget_password");
  },

  async forgotpassword(req, res) {
    const { email } = req.body;
  
    try {
      const user = await contactModel.findOne({ email });
      if (!user) {
        return res.status(404).json({message: "User not found"} );
      }
      const token = jwt.sign(
        { email },
        "miier@tfddc123",
        {
          expiresIn: "30min",
        }
      );
 
      const resetLink = `http://${req.headers.host}/api/reset_password/${token}`;
 
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
 
      const mailOptions = {
        from: "akanshraj616@gmail.com",
        // to: email,
        to: user.email,
        subject: "Password Reset",
        text: ` Reset the password for your account.\n\n
        Click on the following link, or paste the into your browser for the Reset process:\n\n
        ${resetLink}\n\n
        -------------Thank_You-------------\n`,
      };
 
      const response = await transporter.sendMail(mailOptions);
      console.log(response);
      res.json({ message: response.response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
 
  getResetPassword(req, res) {
    const token = req.params.id ;
    res.render("reset_password", {token});
  },
 
  async resetPassword(req, res) {
    const {newPassword, token } = req.body;
    
    const decode = jwt.verify(token, "miier@tfddc123")
    console.log(decode, "*********")
    const {email} = decode;

    try {
      const user = await contactModel.findOne({
        email: email
      })
      console.log(user)
      if (!user) {
        console.log(user);
        return res
          .status(400)
          .json({ error: "Password reset token invalid or expired" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      
      console.log("Hashed Password:", hashedPassword);
 
      await user.save();
 
      res.status(200).json({ message: "Succesfully reset" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
};