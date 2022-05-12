const express = require("express");

const apiV1Router = express.Router();

const { planetesRouter } = require("../routes/planetes/planetes.routes");
const { launchesRouter } = require("../routes/launches/launches.routes");

apiV1Router.use("/planetes",planetesRouter);
apiV1Router.use("/launches",launchesRouter);

module.exports = {
    apiV1Router,
}