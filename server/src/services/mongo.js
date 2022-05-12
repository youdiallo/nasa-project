const mongoose = require("mongoose");

require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("Successfuly connected to MongoDB!");
});
mongoose.connection.on("error", (err) => {
    console.error(err);
});

async function mongooseConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongooseDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongooseConnect,
    mongooseDisconnect,
}