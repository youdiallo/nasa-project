const { 
    existLaunchById,
    getAllLaunches, 
    schedulNewLaunch,
    abortLunchById
 } = require("../../models/launches.models");
 const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res){
    const { skip, limit } = getPagination(req.query);
    const launchess = await getAllLaunches(skip, limit);
    return res.status(200).json(launchess);
}

async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);
    if(!(await existLaunchById(launchId))){
        return res.status(404).json({
                Error: "Launch not found",
            });
    }

    const aborted = await abortLunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            Error: "Launch not aborted",
        });
    }
    return res.status(200).json({
        Ok: true,
    });
}

async function httpAddNewLaunch(req, res){
    const launch = req.body;
    if( (!launch.mission) || (!launch.rocket) || (!launch.target)
        || (!launch.launchDate) ){
            return res.status(400).json({
                Error: "Launch properties missing",
            });
        }
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            Error: "Incorrect launch date format",
        });
    }
    await schedulNewLaunch(launch);
    return res.status(201).json(launch);
}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}