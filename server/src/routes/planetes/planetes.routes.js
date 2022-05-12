const express = require("express");

const {httpGetAllPlanetes} = require("./planetes.controler");

const planetesRouter = express.Router();

planetesRouter.get("/", httpGetAllPlanetes);

module.exports = {
    planetesRouter,
}