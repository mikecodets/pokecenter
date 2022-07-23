import { CustomerService } from "@workspace/ms-customer";
import {
	AccountBuilder,
	CustomerBuilder
} from "../../../../../../shared/builder/main.builder";
import { prismaMock } from "../../../singleton";
import { AccountOperationType } from "../account.enum";
import { AccountService } from "../account.service";

jest.mock("@workspace/ms-customer");

describe("Account service balance", () => {
	it("should not find customer when the objectId is not valid", async () => {
		await AccountService.balance("object-id-not-valid").catch((error) => {
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

	it("should fail if customer does not have account", async () => {
		const customer = new CustomerBuilder().build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);

		await AccountService.balance(customer.id).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Customer does not have account",
						status: 404,
					}),
				),
			);
		});
	});

	it("should return balance", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);
		prismaMock.account.findUnique.mockResolvedValue(account);

		const thisTest = await AccountService.balance(customer.id);

		expect(thisTest.balance).toEqual(account.balance);
	});
});

describe("Account service update", () => {
	it("should not find customer when the objectId is not valid", async () => {
		await AccountService.update(
			"object-id-not-valid",
			0,
			AccountOperationType.INCREMENT,
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

	it("should fail if customer does not have account", async () => {
		const customer = new CustomerBuilder().build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);

		await AccountService.update(
			customer.id,
			800,
			AccountOperationType.INCREMENT,
		).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Customer does not have account",
						status: 404,
					}),
				),
			);
		});
	});

	it("must update the balance when the type of operation is to increment", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);
		prismaMock.account.findUnique.mockResolvedValue(account);
		prismaMock.account.update.mockResolvedValue({
			...account,
			balance: account.balance + 800,
		});

		const thisTest = await AccountService.update(
			customer.id,
			800,
			AccountOperationType.INCREMENT,
		);

		expect(thisTest?.balance).toEqual(account.balance + 800);
	});

	it("must update the balance when the type of operation is to decrement", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();

		jest.spyOn(CustomerService, "find").mockResolvedValue(customer);
		prismaMock.account.findUnique.mockResolvedValue(account);
		prismaMock.account.update.mockResolvedValue({
			...account,
			balance: account.balance - 800,
		});

		const thisTest = await AccountService.update(
			customer.id,
			800,
			AccountOperationType.DECREMENT,
		);

		expect(thisTest?.balance).toEqual(account.balance - 800);
	});
});
