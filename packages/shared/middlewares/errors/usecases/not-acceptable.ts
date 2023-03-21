import { NOT_ACCEPTABLE } from "http-status";
import { HttpErrorHandler } from "../http-error.handler";

export class NotAcceptable extends HttpErrorHandler {
	constructor(message: string) {
		super(message);

		this.status = NOT_ACCEPTABLE;
	}
}
