import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import "express-async-errors";
import morgan from "morgan";
import path from "path";
import {
	HttpErrorHandler,
	HttpErrorHandlerType
} from "../../../shared/errors/httpErrorHandler";
import { API_PORT } from "./config";
import { Routes } from "./core/routes";

export class App {
	public app: Application;
	public port: number;
	public routes: Routes;

	constructor() {
		this.app = express();
		this.port = API_PORT;
		this.routes = new Routes();

		this.app.use(
			(_request: Request, response: Response, next: NextFunction): void => {
				response.header("Access-Control-Allow-Origin", "*");
				response.header(
					"Access-Control-Allow-Headers",
					"Authorization, Origin, X-Requested-With, Content-Type, Accept",
				);
				response.header(
					"Access-Control-Allow-Methods",
					"GET, PUT, POST, DELETE, PATCH, OPTIONS",
				);

				cors();
				next();
			},
		);

		this.app.use(morgan("dev"));
		this.app.use(
			express.static(path.join(__dirname, "..", "..", "..", "docs")),
		);
		this.app.use(express.json({ limit: "1mb" }));
		this.app.use(express.urlencoded({ extended: true }));

		this.app.use("/v1", this.routes.firstVersion);

		this.app.use(
			(
				error: Error,
				_request: Request,
				response: Response,
				_next: NextFunction,
			): Response<Error> => {
				if (error instanceof Error) {
					const { message, status }: HttpErrorHandlerType =
						HttpErrorHandler.errorParser(error);

					return response.status(status).json({
						error: message,
					});
				}

				return response.json({
					error: "Error interno no servidor",
				});
			},
		);

		this.app.listen(this.port, () =>
			console.info(`🎉 API is running on port ${this.port}`),
		);
	}
}

new App();
