import CustomerService from "@workspace/ms-customer";
import { customerGeneratorMock } from "@workspace/ms-customer/src/modules/customer/__tests__/mocks/customer.generator";
import { prismaMock } from "../../../../../shared/clients/prisma/singleton";
import { AccountOperationType } from "../account.enum";
import AccountService from "../account.service";
import { accountGeneratorMock } from "./mocks/account.generator";

jest.mock("@workspace/ms-customer");

describe("Account service balance", () => {
	let accountService: AccountService;
	const mockedCustomerService = jest.mocked(CustomerService);

	beforeEach(() => {
		accountService = new AccountService();
		jest.clearAllMocks();
	});

	describe("getBalance", () => {
		it("should fail if customer does not have account", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			const customerWithAccount = { ...customer, account };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(customerWithAccount);

			await expect(accountService.getBalance(customer.id)).rejects.toThrowError("Account not found");
		});

		it("should return balance", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			const customerWithAccount = { ...customer, account };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(customerWithAccount);

			prismaMock.account.findUnique.mockResolvedValue(account);

			const getBalance = await accountService.getBalance(customer.id);

			expect(getBalance.balance).toEqual(account.balance);
		});
	});

	describe("updateBalance", () => {
		it("should be update the balance when the type of operation is to increment", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			account.balance = 1000;
			const customerWithAccount = { ...customer, account };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(customerWithAccount);

			const id = customer.id;
			const amount = 500;
			const balance = account.balance + amount;
			const type = AccountOperationType.INCREMENT;
			prismaMock.account.update.mockResolvedValue({ ...account, balance });

			const updateBalance = await accountService.updateBalance(id, amount, type);

			expect(updateBalance.balance).toEqual(balance);
		});

		it("should update the balance when the type of operation is to decrement", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			account.balance = 1000;
			const customerWithAccount = { ...customer, account };

			mockedCustomerService.prototype.getById.mockResolvedValueOnce(customerWithAccount);

			const id = customer.id;
			const amount = 500;
			const balance = account.balance - amount;
			const type = AccountOperationType.DECREMENT;

			prismaMock.account.update.mockResolvedValue({ ...account, balance });

			const updateBalance = await accountService.updateBalance(id, amount, type);

			expect(updateBalance.balance).toEqual(balance);
		});
	});
});
