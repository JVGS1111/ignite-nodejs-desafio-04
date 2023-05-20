import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Show user profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to show user's profile", async () => {
        const user = {
            name: "User profile test",
            email: "showuserprofile@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);
        const profile = await showUserProfileUseCase.execute(newUser.id);

        expect(profile).toEqual(newUser);
    })
    it("Should not be able to show user profile if id dont exists", async () => {

        await expect(
            showUserProfileUseCase.execute("222")
        ).rejects.toEqual(new AppError('User not found', 404));

    })
})