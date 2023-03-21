import { BAD_GATEWAY } from "http-status";
import { HttpErrorHandler } from "../http-error.handler";

export class BadGateway extends HttpErrorHandler {
	constructor(message: string) {
		super(message);

		this.status = BAD_GATEWAY;
	}
}
