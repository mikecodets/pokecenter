import { faker } from "@faker-js/faker";
import { CustomerService } from "@workspace/ms-customer";
import {
	AccountBuilder,
	CustomerBuilder,
	TransactionBuilder,
} from "../../../../../../shared/builder/main.builder";
import { AccountService } from "../../account/account.service";
import { TransactionService } from "../transaction.service";

jest.mock("@workspace/ms-customer");
jest.mock("../../account/account.service");

describe("Transaction service deposit", () => {
	it("should not find customer when the objectId is not valid", async () => {
		const transaction = new TransactionBuilder("CREDIT", "DEPOSIT").build();

		await TransactionService.deposit("object-id-not-valid", transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message: "Error, expected a valid object-id",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("must fail when the balance is equal to or less than 0", async () => {
		const customer = new CustomerBuilder().build();
		const transaction = new TransactionBuilder(
			"DEBIT",
			customer.id,
			false,
		).build();

		await TransactionService.deposit(customer.id, transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message:
								"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("should deposit", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();
		const transaction = new TransactionBuilder(
			"PIX",
			customer.id,
			true,
		).build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);
		jest
			.spyOn(AccountService, "update")
			.mockResolvedValue({ ...account, balance: transaction.amount + 50 });

		const customerId = faker.database.mongodbObjectId();
		const thisTest = await TransactionService.deposit(customerId, transaction);

		expect(thisTest.id).not.toEqual(transaction.id);
		expect(thisTest.amount).not.toEqual(transaction.amount + 50);
		expect(thisTest.customerId).toEqual(transaction.customerId);
	});
});

describe("Transaction service withdraw", () => {
	it("should not find customer when the objectId is not valid", async () => {
		const transaction = new TransactionBuilder("CREDIT", "WITHDRAW").build();

		await TransactionService.withdraw("object-id-not-valid", transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message: "Error, expected a valid object-id",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("must fail when the balance is equal to or less than 0", async () => {
		const customer = new CustomerBuilder().build();
		const transaction = new TransactionBuilder(
			"DEBIT",
			customer.id,
			false,
		).build();

		await TransactionService.withdraw(customer.id, transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message:
								"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("must fail when the amount is greater than the balance", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();
		const transaction = new TransactionBuilder(
			"PIX",
			customer.id,
			true,
		).build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);
		jest
			.spyOn(AccountService, "balance")
			.mockResolvedValue({ ...account, balance: transaction.amount - 50 });

		await TransactionService.withdraw(customer.id, transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message:
								"The amount is greater than your account balance, please review your balance and redo the transaction",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("should withdraw", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();
		const transaction = new TransactionBuilder(
			"PIX",
			customer.id,
			true,
		).build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);
		jest
			.spyOn(AccountService, "balance")
			.mockResolvedValue({ ...account, balance: transaction.amount + 50 });
		jest.spyOn(AccountService, "update").mockResolvedValue(account);

		const thisTest = await TransactionService.withdraw(
			customer.id,
			transaction,
		);

		expect(thisTest.id).not.toEqual(transaction.id);
		expect(thisTest.amount).not.toEqual(transaction.amount + 50);
		expect(thisTest.customerId).toEqual(transaction.customerId);
	});
});

describe("Transaction service transfer", () => {
	it("should not find payingId when the objectId is not valid", async () => {
		const receiverId = faker.database.mongodbObjectId();
		const transaction = new TransactionBuilder("CREDIT").build();

		await TransactionService.transfer(
			"object-id-not-valid",
			receiverId,
			transaction,
		).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Error, expected a valid object-id",
						status: 400,
					}),
				),
			);
		});
	});

	it("should not find receiverId when the objectId is not valid", async () => {
		const payingId = faker.database.mongodbObjectId().toString();
		const transaction = new TransactionBuilder("CREDIT").build();

		await TransactionService.transfer(
			payingId,
			"object-id-not-valid",
			transaction,
		).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Error, expected a valid object-id",
						status: 400,
					}),
				),
			);
		});
	});

	it("should fail when trying to perform an auto transfer", async () => {
		const id = faker.database.mongodbObjectId();
		const payingId = id;
		const receiverId = id;
		const transaction = new TransactionBuilder(
			"CREDIT",
			undefined,
			false,
		).build();

		await TransactionService.transfer(payingId, receiverId, transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message: "It is not possible to perform a self transfer",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("must fail when the amount is equal to or less than 0", async () => {
		const payingId = faker.database.mongodbObjectId();
		const receiverId = faker.database.mongodbObjectId();
		const transaction = new TransactionBuilder(
			"CREDIT",
			undefined,
			false,
		).build();

		await TransactionService.transfer(payingId, receiverId, transaction).catch(
			(error) => {
				expect(error).toEqual(
					new Error(
						JSON.stringify({
							message:
								"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
							status: 400,
						}),
					),
				);
			},
		);
	});

	it("should transfer", async () => {
		const transaction = new TransactionBuilder("PIX", undefined, true).build();
		transaction.amount = 100;

		const paying = new CustomerBuilder().build();
		const payingId = paying.id.toString();
		const payingTransaction = new TransactionBuilder(
			"PIX",
			payingId,
			true,
		).build();

		const payingBalance = new AccountBuilder(true).build();
		payingBalance.balance = payingTransaction.amount - 100;

		const receiver = new CustomerBuilder().build();
		const receiverId = receiver.id.toString();
		const receiverTransaction = new TransactionBuilder(
			"PIX",
			receiverId,
			true,
		).build();

		const receiverBalance = new AccountBuilder(true).build();
		receiverBalance.balance = receiverTransaction.amount + 100;

		jest.spyOn(CustomerService, "find").mockResolvedValue(paying);
		jest.spyOn(CustomerService, "find").mockResolvedValue(receiver);

		const payerTransaction = {
			...payingTransaction,
			amount: payingTransaction.amount - transaction.amount,
		};

		jest
			.spyOn(TransactionService, "withdraw")
			.mockResolvedValue(payerTransaction);

		const beneficiaryTransaction = {
			...receiverTransaction,
			amount: receiverTransaction.amount + transaction.amount,
		};

		jest
			.spyOn(TransactionService, "deposit")
			.mockResolvedValue(beneficiaryTransaction);

		const payerBalance = {
			...payingBalance,
			balance: payingBalance.balance - transaction.amount,
		};

		jest.spyOn(AccountService, "balance").mockResolvedValueOnce(payerBalance);

		const beneficiaryBalance = {
			...receiverBalance,
			balance: receiverBalance.balance + transaction.amount,
		};

		jest
			.spyOn(AccountService, "balance")
			.mockResolvedValueOnce(beneficiaryBalance);

		const thisTest = await TransactionService.transfer(
			payingId,
			receiverId,
			transaction,
		);

		expect(thisTest).toMatchObject({
			payer: {
				payerTransaction,
				payerBalance,
			},
			beneficiary: {
				beneficiaryTransaction,
				beneficiaryBalance,
			},
		});
	});
});
