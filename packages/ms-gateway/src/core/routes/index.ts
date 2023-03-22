import { Router } from "express";
import { AccountController } from "../../implementations/account/account.controller";
import { CustomerController } from "../../implementations/customer/customer.controller";
import { TransactionController } from "../../implementations/transaction/transaction.controller";

export default class Routes {
	public readonly router: Router;

	constructor() {
		this.router = Router();

		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post("/customer", CustomerController.create);
		this.router.get("/customer/:customerId", CustomerController.getById);
		this.router.get("/customers", CustomerController.getAll);
		this.router.put("/customer/:customerId", CustomerController.update);
		this.router.delete("/customer/:customerId", CustomerController.delete);
		this.router.get("/balance/:customerId", AccountController.getBalance);
		this.router.post(
			"/transaction/deposit/:customerId",
			TransactionController.deposit,
		);
		this.router.post(
			"/transaction/withdraw/:customerId",
			TransactionController.withdraw,
		);
		this.router.post(
			"/transaction/transfer/:payerId/:receiverId",
			TransactionController.transfer,
		);
	}
}
