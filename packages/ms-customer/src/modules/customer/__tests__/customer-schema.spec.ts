import CustomerSchema from "../customer.schema";

describe("CustomerSchema", () => {
	let customerSchema: CustomerSchema;

	beforeEach(() => {
		customerSchema = new CustomerSchema();
	});

	describe("validateName", () => {
		it("should return no errors for a valid name", async () => {
			const name = "John Doe";
			const validateName = await customerSchema.validateName(name);
			expect(validateName).toBe(undefined);
		});

		it("should throw an error for a null name", async () => {
			const name = null;

			await expect(customerSchema.validateName(name)).rejects.toThrow(
				"The customer name field cannot be null",
			);
		});
	});
});
