import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { prismaClient } from "../src/application/database.js";

describe("POST /api/users", () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "mahmud"
            },
        });
    });

    if (!prismaClient) {
        // console.error("PrismaClient is not initialized.");
    } else {
        // console.log("PrismaClient is initialized.");
    }

    it("should return 200 when register user successfully", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "mahmud",
                password: "123456",
                name: "Mahmud",
            });
        // logger.info(response);
        // console.log('Response status:', response.status);
        // console.log('Response body:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("mahmud");
        expect(response.body.data.name).toBe("Mahmud");
        expect(response.body.data.password).toBeUndefined();
    });

    it("should return 400 when username is empty", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "",
                password: "123456",
                name: "Mahmud",
            });
        expect(response.status).toBe(400);
    });

    it("should return 400 when password is empty", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "mahmud",
                password: "",
                name: "Mahmud",
            });
        expect(response.status).toBe(400);
    });

    it("should return 400 when name is empty", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "mahmud",
                password: "123456",
                name: "",
            });
        expect(response.status).toBe(400);
    });

    it("should return 400 when username is already exists", async () => {
        // Create a uer with the sama username
        await supertest(web)
            .post("/api/users")
            .send({
                username: "mahmud",
                password: "123456",
                name: "Mahmud",
            });

        // Make the request again with the same username
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "mahmud",
                password: "123456",
                name: "Mahmud",
            });
        expect(response.status).toBe(400);
    });
});