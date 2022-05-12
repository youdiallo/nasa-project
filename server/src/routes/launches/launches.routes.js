const express = require("express");
const launchesRouter = express.Router();

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require("./launches.controler");

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = {
    launchesRouter,
}