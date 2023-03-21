import { BAD_REQUEST } from "http-status";
import { HttpErrorHandler } from "../http-error.handler";

export class BadRequest extends HttpErrorHandler {
	constructor(message: string) {
		super(message);

		this.status = BAD_REQUEST;
	}
}
