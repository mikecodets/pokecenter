export type HttpErrorHandlerType = {
	message: string;
	status: number;
};

export class HttpErrorHandler {
	public static targetError({ message, status }: HttpErrorHandlerType): string {
		return JSON.stringify({
			message,
			status,
		});
	}

	public static errorParser(error: Error): HttpErrorHandlerType {
		return JSON.parse(error.message);
	}
}
