import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to create a new user", async () => {
        const user = {
            name: "Usuario test",
            email: "email@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);

        expect(newUser.name).toBe(user.name);
    })

    it("Should not be able to create a new user if name already exists", async () => {
        const user = {
            name: "Usuario test",
            email: "email@test.com",
            password: "123456"
        }
        await createUserUseCase.execute(user);
        await expect(
            createUserUseCase.execute(user)
        ).rejects.toEqual(new AppError('User already exists'));
    })
})