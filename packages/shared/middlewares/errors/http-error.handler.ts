import { INTERNAL_SERVER_ERROR } from "http-status";

export class HttpErrorHandler extends Error {
	public name: string;
	public status: number;

	constructor(message: string) {
		super(message);

		this.name = this.constructorNameToUpperCase(this.constructor.name);
		this.message = message;
		this.status = INTERNAL_SERVER_ERROR;
	}

	private constructorNameToUpperCase(name: string): string {
		return name.toUpperCase();
	}
}
