import CustomerService from "@workspace/ms-customer";
import { customerGeneratorMock } from "@workspace/ms-customer/src/modules/customer/__tests__/mocks/customer.generator";
import { prismaMock } from "../../../../../shared/clients/prisma/singleton";
import AccountService from "../../account/account.service";
import { accountGeneratorMock } from "../../account/__tests__/mocks/account.generator";
import TransactionService from "../transaction.service";
import { transactionGeneratorMock } from "./mocks/transaction.generator";

jest.mock("@workspace/ms-customer");
jest.mock("../../account/account.service");

describe("TransactionService", () => {
	let transactionService: TransactionService;
	const mockedCustomerService = jest.mocked(CustomerService);
	const mockedAccountService = jest.mocked(AccountService);

	beforeEach(() => {
		transactionService = new TransactionService();
		jest.clearAllMocks();
	});

	describe("deposit", () => {
		it("should deposit amount to the customer account and create transaction", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			const customerWithAccount = { ...customer, account };
			const transaction = transactionGeneratorMock();

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(
				customerWithAccount,
			);
			mockedAccountService.prototype.updateBalance.mockResolvedValueOnce(
				account,
			);

			prismaMock.transaction.create.mockResolvedValueOnce(transaction);

			const deposit = await transactionService.deposit({
				customerId: customer.id,
				transaction,
			});

			expect(deposit).toEqual(transaction);
		});
	});

	describe("withdraw", () => {
		it("should withdraw money from account and create a transaction", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			account.balance = 1000;
			const transaction = transactionGeneratorMock();
			transaction.customerId = customer.id;
			transaction.amount = 500;
			const customerWithAccount = { ...customer, account };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(
				customerWithAccount,
			);
			mockedAccountService.prototype.getBalance.mockResolvedValueOnce(account);
			mockedAccountService.prototype.updateBalance.mockResolvedValueOnce(
				account,
			);

			prismaMock.transaction.create.mockResolvedValue(transaction);

			const withdraw = await transactionService.withdraw({
				customerId: customer.id,
				transaction,
			});

			expect(withdraw.amount).toBe(transaction.amount);
			expect(withdraw.methodPayment).toBe(transaction.methodPayment);
			expect(withdraw.operation).toBe(transaction.operation);
		});

		it("should throw NotAcceptable error if the amount is greater than account balance", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			account.balance = 0;
			const transaction = transactionGeneratorMock();
			transaction.customerId = customer.id;
			transaction.amount = 500;
			const customerWithAccount = { ...customer, account };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(
				customerWithAccount,
			);
			mockedAccountService.prototype.getBalance.mockResolvedValueOnce(account);

			prismaMock.transaction.create.mockResolvedValue(transaction);

			await expect(
				transactionService.withdraw({ customerId: customer.id, transaction }),
			).rejects.toThrow(
				"The amount is greater than your account balance, please review your balance and redo the transaction",
			);
		});
	});

	describe("transfer", () => {
		test("should validate transaction amount", async () => {
			const payer = customerGeneratorMock();
			const receiver = customerGeneratorMock();
			const transaction = transactionGeneratorMock();
			transaction.amount = -50;

			await expect(
				transactionService.transfer({
					payerId: payer.id,
					receiverId: receiver.id,
					transaction,
				}),
			).rejects.toThrow();
		});

		it("should reject self transfer", async () => {
			const customer = customerGeneratorMock();
			const transaction = transactionGeneratorMock();
			transaction.customerId = customer.id;
			await expect(
				transactionService.transfer({
					payerId: customer.id,
					receiverId: customer.id,
					transaction,
				}),
			).rejects.toThrowError("It is not possible to perform a self transfer");
		});

		it("should withdraw from payer and deposit to receiver", async () => {
			const transaction = transactionGeneratorMock();

			const payer = customerGeneratorMock();
			const accountPaying = accountGeneratorMock();
			payer.accountId = accountPaying.id;
			const payerWithAccount = { ...payer, account: accountPaying };

			const receiver = customerGeneratorMock();
			const accountBeneficiary = accountGeneratorMock();
			receiver.accountId = accountBeneficiary.id;
			const receiverWithAccount = { ...payer, account: accountBeneficiary };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(
				payerWithAccount,
			);
			mockedCustomerService.prototype.getById.mockResolvedValueOnce(
				receiverWithAccount,
			);

			jest
				.spyOn(TransactionService.prototype, "deposit")
				.mockResolvedValue(transaction);
			jest
				.spyOn(TransactionService.prototype, "withdraw")
				.mockResolvedValue(transaction);

			mockedAccountService.prototype.getBalance.mockResolvedValueOnce(
				accountPaying,
			);
			mockedAccountService.prototype.getBalance.mockResolvedValueOnce(
				accountBeneficiary,
			);

			const payerId = payer.id;
			const receiverId = receiver.id;

			const transfer = await transactionService.transfer({
				payerId,
				receiverId,
				transaction,
			});

			expect(transfer).toMatchObject({
				payer: { transaction, account: accountPaying },
				receiver: { transaction, account: accountBeneficiary },
			});
		});
	});
});
