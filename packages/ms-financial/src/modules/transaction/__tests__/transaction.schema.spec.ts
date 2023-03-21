import TransactionSchema from "../transaction.schema";

describe("TransactionSchema", () => {
	let transactionSchema: TransactionSchema;

	beforeEach(() => {
		transactionSchema = new TransactionSchema();
	});

	describe("validateAmount", () => {
		it("should return no errors for a valid amount", async () => {
			const amount = 100;
			const validateAmount = await transactionSchema.validateAmount(amount);
			expect(validateAmount).toBe(undefined);
		});

		it("should return an error for a negative amount", async () => {
			const amount = -50;
			await expect(transactionSchema.validateAmount(amount)).rejects.toThrow(
				"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
			);
		});

		it("should return an error for a zero amount", async () => {
			const amount = 0;
			await expect(transactionSchema.validateAmount(amount)).rejects.toThrow(
				"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
			);
		});
	});
});
