const mongoose = require("mongoose");

const planetesSchema = mongoose.Schema({
    kepler_name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Planete", planetesSchema);