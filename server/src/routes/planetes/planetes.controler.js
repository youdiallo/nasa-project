const { getAllPlanetes } = require("../../models/planetes.models");

 async function httpGetAllPlanetes(req, res){
    return res.status(200).json( await getAllPlanetes());
}


module.exports = {
    httpGetAllPlanetes,
}