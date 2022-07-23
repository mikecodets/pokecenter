import {
	AccountBuilder,
	CustomerBuilder
} from "../../../../../../shared/builder/main.builder";
import { prismaMock } from "../../../singleton";
import { CustomerService } from "../customer.service";

describe("Customer service create", () => {
	it("should not create customer when there is already another customer", async () => {
		const customer = new CustomerBuilder().build();

		await CustomerService.create({
			...customer,
			name: "",
		}).catch((error) => {
			expect(error.message).toEqual(
				JSON.stringify({
					message: "The customer name field cannot be null",
					status: 400,
				}),
			);
		});
	});

	it("should not create a customer when the name is duplicated", async () => {
		const customer = new CustomerBuilder().build();
		prismaMock.customer.findUnique.mockResolvedValue(customer);

		await CustomerService.create(customer).catch((error) => {
			expect(error.message).toEqual(
				JSON.stringify({
					message: "Customer already exists",
					status: 401,
				}),
			);
		});
	});

	it("should create customer", async () => {
		const customer = new CustomerBuilder().build();
		prismaMock.customer.create.mockResolvedValue(customer);

		const thisTest = await CustomerService.create(customer);

		expect(thisTest).not.toBeUndefined();
		expect(thisTest).toMatchObject(customer);
		expect(thisTest.id).toEqual(customer.id);
	});
});

describe("Customer service find", () => {
	it("should not find customer when the objectId is not valid", async () => {
		await CustomerService.find("object-id-not-valid").catch((error) => {
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

	it("should not find customer when it does not exist", async () => {
		const customer = new CustomerBuilder().build();

		await CustomerService.find(customer.id).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Customer does not exists",
						status: 404,
					}),
				),
			);
		});
	});

	it("should find customer", async () => {
		const customer = new CustomerBuilder().build();
		prismaMock.customer.findUnique.mockResolvedValue(customer);

		const thisTest = await CustomerService.find(customer.id);

		expect(thisTest).not.toBeUndefined();
		expect(thisTest).toMatchObject(customer);
		expect(thisTest.id).toEqual(customer.id);
	});
});

describe("Customer service find all", () => {
	it("should find all customers", async () => {
		const customers = [...Array(5)].map(() => new CustomerBuilder().build());
		prismaMock.customer.findMany.mockResolvedValue(customers);

		const thisTest = await CustomerService.findAll();

		expect(thisTest).not.toBeUndefined();
		expect(thisTest).toMatchObject(customers);
	});
});

describe("Customer service update", () => {
	it("should not create customer when there is already another customer", async () => {
		const customer = new CustomerBuilder().build();

		await CustomerService.update(customer.id, {
			...customer,
			name: "",
		}).catch((error) => {
			expect(error.message).toEqual(
				JSON.stringify({
					message: "The customer name field cannot be null",
					status: 400,
				}),
			);
		});
	});

	it("should not update customer when the objectId is not valid", async () => {
		const customer = new CustomerBuilder().build();

		await CustomerService.update("object-id-not-valid", customer).catch(
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

	it("should not update customer when it does not exist", async () => {
		const customer = new CustomerBuilder().build();

		await CustomerService.update(customer.id, customer).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Customer does not exists",
						status: 404,
					}),
				),
			);
		});
	});

	it("should update customer", async () => {
		const customer = new CustomerBuilder().build();

		prismaMock.customer.findUnique.mockResolvedValue(customer);
		prismaMock.customer.update.mockResolvedValue(customer);

		const thisTest = await CustomerService.update(customer.id, customer);

		expect(thisTest).not.toBeUndefined();
		expect(thisTest).toMatchObject(customer);
	});
});

describe("Customer service delete", () => {
	it("should not delete customer when the objectId is not valid", async () => {
		await CustomerService.delete("object-id-not-valid").catch((error) => {
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

	it("should not find customer when it does not exist", async () => {
		const customer = new CustomerBuilder().build();

		await CustomerService.delete(customer.id).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message: "Customer does not exists",
						status: 404,
					}),
				),
			);
		});
	});

	it("should not delete the customer when he still has a positive balance", async () => {
		const account = new AccountBuilder(true).build();
		const customer = new CustomerBuilder(account).build();

		prismaMock.customer.findUnique.mockResolvedValue(customer);

		await CustomerService.delete(customer.id).catch((error) => {
			expect(error).toEqual(
				new Error(
					JSON.stringify({
						message:
							"Customer has available balance, a transfer is still required for the transaction or account available",
						status: 401,
					}),
				),
			);
		});
	});

	it("should delete customer", async () => {
		const customer = new CustomerBuilder().build();
		prismaMock.customer.findUnique.mockResolvedValue(customer);
		prismaMock.customer.delete.mockResolvedValue(customer);

		const thisTest = await CustomerService.delete(customer.id);

		expect(thisTest).not.toBeUndefined();
		expect(thisTest).toMatchObject(customer);
	});
});
