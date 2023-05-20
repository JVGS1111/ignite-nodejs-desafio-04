import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { AppError } from '../../../../shared/errors/AppError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to authenticate user", async () => {
        const user = {
            name: "test auth",
            email: "emailauth@test.com",
            password: "123456"
        }
        await createUserUseCase.execute(user);
        const response = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })
        expect(response.token).toBeTruthy();
    })
    it("Should not able to authenticate a user if password is wrong", async () => {
        const user = {
            name: "test auth",
            email: "emailauth@test.com",
            password: "123456"
        }
        await createUserUseCase.execute(user);
        const loginData = {
            email: user.email,
            password: "22222"
        }
        await expect(
            authenticateUserUseCase.execute(loginData)
        ).rejects.toEqual(new AppError("Incorrect email or password", 401));
    })
    it("Should not able to authenticate a user if email is wrong", async () => {
        const user = {
            name: "test auth",
            email: "emailauth@test.com",
            password: "123456"
        }
        await createUserUseCase.execute(user);
        const loginData = {
            email: "emailfail@test.com",
            password: user.password
        }
        await expect(
            authenticateUserUseCase.execute(loginData)
        ).rejects.toEqual(new AppError("Incorrect email or password", 401));
    })
})