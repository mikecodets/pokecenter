import { BAD_GATEWAY } from "http-status";
import { BadGateway } from "../bad-gateway";

describe("BadGateway", () => {
	it("should be create an instance of the Bad Gateway class", () => {
		const errorMessage = "Gateway Error";
		const badGateway = new BadGateway(errorMessage);
		expect(badGateway).toBeInstanceOf(BadGateway);
		expect(badGateway.message).toEqual(errorMessage);
		expect(badGateway.status).toEqual(BAD_GATEWAY);
	});
});
