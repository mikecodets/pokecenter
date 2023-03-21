import { accountGeneratorMock } from "@workspace/ms-financial/src/modules/account/__tests__/mocks/account.generator";
import { prismaMock } from "../../../../../shared/clients/prisma/singleton";
import { CustomerService } from "../customer.service";
import {
	customerGeneratorMock,
	customersGeneratorMock,
} from "./mocks/customer.generator";

describe("Customer Service", () => {
	let customerService: CustomerService;

	beforeEach(() => {
		customerService = new CustomerService();
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should not create customer when there is already another customer", async () => {
			const customer = customerGeneratorMock(true);

			await expect(customerService.create(customer)).rejects.toThrowError(
				"The customer name field cannot be null",
			);
		});

		it("should not create a customer when is duplicated", async () => {
			const customer = customerGeneratorMock();

			prismaMock.customer.findUnique.mockResolvedValue(customer);

			await expect(customerService.create(customer)).rejects.toThrow(
				"This customer already exists in our system",
			);
		});

		it("should create customer", async () => {
			const customer = customerGeneratorMock();

			prismaMock.customer.create.mockResolvedValue(customer);

			const create = await customerService.create(customer);

			expect(create).not.toBeUndefined();
			expect(create).toMatchObject(customer);
			expect(create.id).toEqual(customer.id);
		});
	});

	describe("getById", () => {
		it("should not find customer when the objectId is not valid", async () => {
			await expect(
				customerService.getById("object-id-not-valid"),
			).rejects.toThrow("Error, expected a valid object-id");
		});

		it("should not find customer when it does not exist", async () => {
			const customer = customerGeneratorMock();
			await expect(customerService.getById(customer.id)).rejects.toThrow(
				"This customer does not exist in our system",
			);
		});

		it("should find customer", async () => {
			const customer = customerGeneratorMock();

			prismaMock.customer.findUnique.mockResolvedValue(customer);

			const getById = await customerService.getById(customer.id);

			expect(getById).not.toBeUndefined();
			expect(getById).toMatchObject(customer);
			expect(getById.id).toEqual(customer.id);
		});
	});

	describe("getAll", () => {
		it("should find all customers", async () => {
			const customers = customersGeneratorMock();

			prismaMock.customer.findMany.mockResolvedValue(customers);

			const getAll = await customerService.getAll();

			expect(getAll).not.toBeUndefined();
			expect(getAll).toMatchObject(customers);
		});
	});

	describe("update", () => {
		it("should not update customer when it does not exist", async () => {
			const customer = customerGeneratorMock();

			await expect(
				customerService.update(customer.id, customer),
			).rejects.toThrow("This customer does not exist in our system");
		});

		it("should not create customer when there is already another customer", async () => {
			const customer = customerGeneratorMock(true);
			prismaMock.customer.findUnique.mockResolvedValue(customer);

			await expect(
				customerService.update(customer.id, customer),
			).rejects.toThrow("The customer name field cannot be null");
		});

		it("should not update customer when the objectId is not valid", async () => {
			const customer = customerGeneratorMock();
			prismaMock.customer.findUnique.mockResolvedValue(customer);

			await expect(
				customerService.update("object-id-not-valid", customer),
			).rejects.toThrow("Error, expected a valid object-id");
		});

		it("should update customer", async () => {
			const customer = customerGeneratorMock();
			prismaMock.customer.findUnique.mockResolvedValue(customer);
			prismaMock.customer.update.mockResolvedValue(customer);
			const update = await customerService.update(customer.id, customer);

			expect(update).not.toBeUndefined();
			expect(update).toMatchObject(customer);
		});
	});

	describe("delete", () => {
		it("should not find customer when it does not exist", async () => {
			const customer = customerGeneratorMock();

			await expect(customerService.delete(customer.id)).rejects.toThrow(
				"This customer does not exist in our system",
			);
		});

		it("should not delete customer when the objectId is not valid", async () => {
			await expect(
				customerService.delete("object-id-not-valid"),
			).rejects.toThrow("Error, expected a valid object-id");
		});

		it("should not delete the customer when he still has a positive balance", async () => {
			const customer = customerGeneratorMock();
			const account = accountGeneratorMock();
			customer.accountId = account.id;
			const customerWithAccount = { ...customer, account: account };

			prismaMock.customer.findUnique.mockResolvedValue(customerWithAccount);

			await expect(customerService.delete(customer.id)).rejects.toThrow(
				"This customer still has a positive balance and cannot be deleted. Please transfer the remaining balance or close the account first.",
			);
		});

		it("should delete customer", async () => {
			const customer = customerGeneratorMock();

			prismaMock.customer.findUnique.mockResolvedValue(customer);
			prismaMock.customer.delete.mockResolvedValue(customer);

			await expect(
				customerService.delete(customer.id),
			).resolves.toBeUndefined();
		});
	});
});
