const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: false,
    },
    newUsername: {
        type: String,
        required: false,
        trim: true
    },
    newAge: {
        type: Number,
        required: false,
        trim: true
    },
    resetPasswordToken: {
        type: String
      },
    resetPasswordExpires: {
        type: Date
    },
    date:{
    type: Date,
    default: Date.now,
    },

});

const contactModel = mongoose.model("contact", contactSchema);
module.exports = contactModel ;
