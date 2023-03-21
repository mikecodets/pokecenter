import { NOT_FOUND } from "http-status";
import { HttpErrorHandler } from "../http-error.handler";

export class NotFound extends HttpErrorHandler {
	constructor(message: string) {
		super(message);

		this.status = NOT_FOUND;
	}
}
