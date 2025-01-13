import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        },
    });
}

const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: bcrypt.hashSync("123456", 10),
            name: "Test",
            token: 'test',
        },
    });
}

export {
    removeTestUser,
    createTestUser
};