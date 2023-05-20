import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create new statement", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository,
        );
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    })

    it("Should be able to create a new statement", async () => {
        const user = {
            name: "User statement test",
            email: "statementtest@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);
        const deposit = await createStatementUseCase.execute({
            user_id: newUser.id,
            type: OperationType["DEPOSIT"],
            amount: 500,
            description: "test"
        })

        expect(deposit.amount).toEqual(500);
    });

    it("Should be able to do a withdraw", async () => {
        const user = {
            name: "User withdraw test",
            email: "withdraw@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);
        await createStatementUseCase.execute({
            user_id: newUser.id,
            type: OperationType["DEPOSIT"],
            amount: 500,
            description: "test"
        })
        await createStatementUseCase.execute({
            user_id: newUser.id,
            type: OperationType["WITHDRAW"],
            amount: 400,
            description: "test"
        })

        const balance = await getBalanceUseCase.execute({
            user_id: newUser.id
        });

        expect(balance.balance).toEqual(100);
    });

    it("Should not be able to do a withdraw if don't have sufficient funds", async () => {
        const user = {
            name: "User withdraw error test",
            email: "withdrawerror@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);

        const data = {
            user_id: newUser.id,
            type: OperationType["WITHDRAW"],
            amount: 400,
            description: "test"
        }
        await expect(
            createStatementUseCase.execute(data)
        ).rejects.toEqual(new AppError("Insufficient funds", 400));

    });

    it("Should not be able to create statement if user don't exist", async () => {

        const data = {
            user_id: "000",
            type: OperationType["WITHDRAW"],
            amount: 400,
            description: "test"
        }
        await expect(
            createStatementUseCase.execute(data)
        ).rejects.toEqual(new AppError("User not found", 404));

    });
})