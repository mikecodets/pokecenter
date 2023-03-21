import { BAD_REQUEST } from "http-status";
import { BadRequest } from "../bad-request";

describe("BadRequest", () => {
	it("should be create an instance of the Bad Request class", () => {
		const errorMessage = "Gateway Error";
		const badRequest = new BadRequest(errorMessage);
		expect(badRequest).toBeInstanceOf(BadRequest);
		expect(badRequest.message).toEqual(errorMessage);
		expect(badRequest.status).toEqual(BAD_REQUEST);
	});
});
