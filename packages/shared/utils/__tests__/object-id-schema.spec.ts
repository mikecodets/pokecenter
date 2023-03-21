import ObjectIdSchema from "../object-id.schema";

describe("ObjectIdSchema", () => {
	let objectIdSchema: ObjectIdSchema;

	beforeEach(() => {
		objectIdSchema = new ObjectIdSchema();
	});

	describe("validateObjectId", () => {
		it("should return no errors for a valid object-id", async () => {
			const id = "602c81e2d8f14a93c8a9b28d";
			const validationResult = await objectIdSchema.validateObjectId(id);
			expect(validationResult).toBe(undefined);
		});

		it("should return an error for an invalid object-id", async () => {
			await expect(objectIdSchema.validateObjectId("invalid-id")).rejects.toThrow("Error, expected a valid object-id");
		});

		it("should return an error for a null object-id", async () => {
			await expect(objectIdSchema.validateObjectId(null)).rejects.toThrow("Error, expected a valid object-id");
		});
	});
});
