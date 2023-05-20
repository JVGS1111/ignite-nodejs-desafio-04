import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository,
        );
    });

    it("Should be able to get balance", async () => {
        const user = {
            name: "user",
            email: "user@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);
        const balance = await getBalanceUseCase.execute({ user_id: newUser.id });

        expect(balance.balance).toEqual(0);
        expect(balance.statement.length).toBe(0);
    })

    it("Should not be able to get balance if user don't exist", async () => {

        await expect(
            getBalanceUseCase.execute({ user_id: "000" })
        ).rejects.toEqual(new AppError("User not found", 404));
    })
})