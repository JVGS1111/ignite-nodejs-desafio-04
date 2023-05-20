import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("get statement operation", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    })

    it("Should be able to get statement", async () => {
        const user = {
            name: "User statement test",
            email: "statementtest@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);
        const statementData = {
            user_id: newUser.id,
            type: OperationType["DEPOSIT"],
            amount: 500,
            description: "test"
        }
        const deposit = await createStatementUseCase.execute(statementData);
        const statement = await getStatementOperationUseCase.execute({
            user_id: newUser.id,
            statement_id: deposit.id
        });
        expect(statement.amount).toEqual(statementData.amount);
        expect(statement.description).toBe(statementData.description);
        expect(statement.type).toBe(statementData.type);
    });
    it("Should not be able to get statement if user not exists", async () => {

        await expect(
            getStatementOperationUseCase.execute({
                user_id: "000",
                statement_id: "000"
            })
        ).rejects.toEqual(new AppError('User not found', 404));

    });
    it("Should not be able to get statement if statement not exists", async () => {
        const user = {
            name: "User statement test",
            email: "statementtest@test.com",
            password: "123456"
        }
        const newUser = await createUserUseCase.execute(user);
        await expect(
            getStatementOperationUseCase.execute({
                user_id: newUser.id,
                statement_id: "000"
            })
        ).rejects.toEqual(new AppError('Statement not found', 404));

    });

})