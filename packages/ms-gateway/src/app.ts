import "express-async-errors";

import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import { HttpErrorHandler } from "../../shared/middlewares/errors/http-error.handler";
import { API_PORT } from "./config";
import Routes from "./core/routes";

export class App {
	app: Application;
	port: number;
	routes: Routes;

	constructor() {
		this.app = express();
		this.port = API_PORT;
		this.routes = new Routes();

		this.setupCorsHandling();
		this.setupMiddlewares();
		this.setupRoutes();
		this.setupErrorHandling();
	}

	private setupCorsHandling() {
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
	}

	private setupMiddlewares() {
		this.app.use(morgan("dev"));
		this.app.use(express.static(path.join(path.resolve("..", "..", "docs"))));
		this.app.use(express.json({ limit: "1mb" }));
		this.app.use(express.urlencoded({ extended: true }));
	}

	private setupRoutes() {
		this.app.use("/api", this.routes.router);
	}

	private setupErrorHandling() {
		this.app.use(
			(
				error: Error,
				_request: Request,
				response: Response,
				_next: NextFunction,
			): Response => {
				if (error instanceof HttpErrorHandler) {
					return response.status(error.status).json({
						error: {
							name: error.name,
							message: error.message,
							status: error.status,
						},
					});
				}

				return response.json({ error: "⛔ error interno no servidor" });
			},
		);
	}

	start() {
		this.app.listen(this.port, () =>
			console.log(`🎉 API is running on port ${this.port}`),
		);
	}
}

new App().start();
