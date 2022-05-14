const axios = require("axios");

const launches = require("./launches.mongo");
const planetes = require("./planetes.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const DEFAULT_FLIGHT_NUMBER = 100; 

async function populateLaunches(){
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        "customers": 1
                    }
                }
                
            ]
        }
    });

    if ( response.status !== 200){
        console.log("Problem downloading launches!");
        throw new Error("Launch data download failed!");
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {

        const payloads = launchDoc["payloads"];
        const customers = payloads.flatMap((payload) => {
            return payload["customers"];
        });

        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers,
        };

        await saveLaunche(launch);
    }
}

async function loadLaunchesData() {
    
    const spacexLaunchExist = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });

    if(spacexLaunchExist){
        console.log("lauch data already loaded!");
    }else{
        console.log("Downloading launch data...");
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existLaunchById(id){
    return await findLaunch({
        flightNumber: id,
    });
}

async function getAllLaunches(skip, limit){
    return await launches
        .find({}, {"_id": 0, "__v": 0 })
        .sort("flightNumber: 1")
        .skip(skip)
        .limit(limit);
}


async function schedulNewLaunch(launch){
    const newFlightNumber = await getLastestFlightNumber() + 1;
    const completedLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ["ZTM", "NASA"],
        upcoming: true,
        success: true,
    });

    const planet = await planetes.findOne({
        target: launch.kepler_name
    });
    if(!planet){
        throw new Error("No matching planet found!");
    }

    /* launch already existe? */
    const launchExist = await launches.findOne({
        mission: launch.mission,
        rocket: launch.rocket,
        launchDate: launch.launchDate,
        target: launch.target,
        customers: launch.customers,
    });
    if(launchExist){
        await launches.findOneAndUpdate({
            mission: launch.mission,
            rocket: launch.rocket,
            launchDate: launch.launchDate,
            target: launch.target,
            customers: launch.customers,
        }, {
            upcoming: true,
            success: true,
            flightNumber: launch.flightNumber - 1,
        }, {
            upsert: true,
        });
    }else{
        await saveLaunche(completedLaunch);   
    }
}

async function getLastestFlightNumber(){
    const latestLaunch = await launches
        .findOne()
        .sort("-flightNumber");
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber; 
}

async function saveLaunche(launch){
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function abortLunchById(id){
    const aborted = await launches.updateOne({
        flightNumber: id,
    }, {
        upcoming: false,
        success: false,
    });

    return ( aborted.modifiedCount === 1);
}

module.exports = {
    existLaunchById,
    getAllLaunches,
    schedulNewLaunch,
    abortLunchById,
    loadLaunchesData,
};