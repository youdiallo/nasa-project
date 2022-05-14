const app = require("../../app");
const request = require("supertest");

const {
    mongooseConnect,
    mongooseDisconnect,
}  = require("../../services/mongo");

const {
    loadPlanetes,
} = require("../../models/planetes.models");

describe("Test launches", () => {

    beforeAll(async () => {
        await loadPlanetes();
        await mongooseConnect();
    });

    afterAll(async () => {
        await mongooseDisconnect();
    });

    describe('Test Get/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/)
                .expect(200);
        });
    });
    
    describe("Test Post/launches", () => {
        const completeLaunchData = {
            mission: "Apolo 43542",
            target: "Kepler-234 f",
            launchDate: "March 18, 2040",
            rocket: "The African rocket"
        };
        const launchDataWithoutDate = {
            mission: "Apolo 43542",
            target: "Kepler-234 f",
            rocket: "The African rocket"
        };
        const launchDataWithIncorrectDateFormat = {
            mission: "Apolo 43542",
            target: "Kepler-234 f",
            launchDate: "HEllo",
            rocket: "The African rocket"
        };
    
        test("It should response with 201 success", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
                
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
            
        });
    
        test("It should response with 400", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithoutDate)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                Error: "Launch properties missing",
            });
        });
    
        test("It should response with 400", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithIncorrectDateFormat)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                Error: "Incorrect launch date format",
            });
        });
    });
});