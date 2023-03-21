import TransactionSchema from "../transaction.schema";

describe("TransactionSchema", () => {
	let transactionSchema: TransactionSchema;

	beforeEach(() => {
		transactionSchema = new TransactionSchema();
		jest.clearAllMocks();
	});

	describe("validateAmount", () => {
		it("should return no errors for a valid amount", async () => {
			const validateAmount = await transactionSchema.validateAmount(100);
			expect(validateAmount).toBe(undefined);
		});

		it("should return an error for a negative amount", async () => {
			await expect(transactionSchema.validateAmount(-50)).rejects.toThrow(
				"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
			);
		});

		it("should return an error for a zero amount", async () => {
			await expect(transactionSchema.validateAmount(0)).rejects.toThrow(
				"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
			);
		});
	});
});
