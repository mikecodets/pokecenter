import { NOT_FOUND } from "http-status";
import { NotFound } from "../not-found";

describe("NotFound", () => {
	it("should be create an instance of the Not Found class", () => {
		const errorMessage = "Gateway Error";
		const notFound = new NotFound(errorMessage);
		expect(notFound).toBeInstanceOf(NotFound);
		expect(notFound.message).toEqual(errorMessage);
		expect(notFound.status).toEqual(NOT_FOUND);
	});
});
