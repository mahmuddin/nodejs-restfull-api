import { validate } from "../validation/validation.js";
import { loginUserValidation, registerUserValidation } from "../validation/user-valiation.js";
import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid'

const register = async (request) => {
    const user = validate(registerUserValidation, request);
    // console.log('Validated user:', user);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    // console.log('Password before hashing:', user.password);
    user.password = await bcrypt.hash(user.password, 10);
    // console.log('Password after hashing:', user.password);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);
    // console.log('Validated user:', user);

    const userData = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true,
        }
    });

    if (!userData) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    const isPasswordCorrect = await bcrypt.compare(loginRequest.password, userData.password);

    if (!isPasswordCorrect) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    const token = uuid().toString();
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: userData.username
        },
        select: {
            token: true,
        }
    });
}
export default { register, login };