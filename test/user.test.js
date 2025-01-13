import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, removeTestUser } from "./test-util.js";

describe("POST /api/users", () => {
    afterEach(async () => {
        await removeTestUser();
    });

    it("should return 200 when register user successfully", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "123456",
                name: "Test",
            });
        // logger.info(response);
        // console.log('Response status:', response.status);
        // console.log('Response body:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("Test");
        expect(response.body.data.password).toBeUndefined();
    });

    it("should return 400 when username is empty", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "",
                password: "123456",
                name: "Test",
            });
        // console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('"username" is not allowed to be empty');
    });

    it("should return 400 when password is empty", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "",
                name: "Test",
            });
        // console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('"password" is not allowed to be empty');
    });

    it("should return 400 when name is empty", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "123456",
                name: "",
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('"name" is not allowed to be empty');
    });

    it("should return 400 when username is already exists", async () => {
        // Create a uer with the sama username
        await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "123456",
                name: "Test",
            });

        // Make the request again with the same username
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "123456",
                name: "Test",
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBe("Username already exists");
    });
});

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should return 200 when login user successfully", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "123456",
            });

        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.token).not.toBe("test");
    });

    it("should return 400 when username is empty", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "",
                password: "123456",
            });
        // console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('"username" is not allowed to be empty');
    });

    it("should return 400 when password is empty", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "",
            });
        // console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('"password" is not allowed to be empty');
    });

    it("should return 401 when username or password is incorrect", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "12345",
            });
        // console.log(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("Username or password is incorrect");
    });
});