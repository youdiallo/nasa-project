const http = require("http");

require("dotenv").config();

const app = require("./app")
const { loadPlanetes } = require("./models/planetes.models");
const { loadLaunchesData } = require("./models/launches.models");
const {
    mongooseConnect,
    mongooseDisconnect,
}  = require("./services/mongo");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer(){
    await mongooseConnect();
    await loadPlanetes();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

startServer();