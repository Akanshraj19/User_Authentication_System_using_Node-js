const mongoose = require("mongoose");
const dash1 = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    Quantity: {
        type: Number,
        required: false,
    },

});

const dashModel = mongoose.model("dashSch", dash1);
module.exports = dashModel ;