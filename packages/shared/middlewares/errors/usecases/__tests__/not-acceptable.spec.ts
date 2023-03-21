import { NOT_ACCEPTABLE } from "http-status";
import { NotAcceptable } from "../not-acceptable";

describe("NotAcceptable", () => {
	it("should be create an instance of the Not Acceptable class", () => {
		const errorMessage = "Gateway Error";
		const notAcceptable = new NotAcceptable(errorMessage);
		expect(notAcceptable).toBeInstanceOf(NotAcceptable);
		expect(notAcceptable.message).toEqual(errorMessage);
		expect(notAcceptable.status).toEqual(NOT_ACCEPTABLE);
	});
});
