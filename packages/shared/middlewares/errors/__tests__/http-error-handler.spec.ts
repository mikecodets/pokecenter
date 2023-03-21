import { HttpErrorHandler } from "../http-error.handler";

describe("HttpErrorHandler", () => {
	const message = "Error message";

	it("must instantiate correctly", () => {
		const error = new HttpErrorHandler(message);

		expect(error.message).toBe(message);
		expect(error.status).toBe(500);
		expect(error.message).toBe(message);
		expect(error.name).toBe("HTTPERRORHANDLER");
	});

	it("should have default status like 500", () => {
		const error = new HttpErrorHandler(message);
		expect(error.status).toBe(500);
	});

	it("should inherit from Error", () => {
		const error = new HttpErrorHandler(message);
		expect(error instanceof Error).toBe(true);
	});
});
