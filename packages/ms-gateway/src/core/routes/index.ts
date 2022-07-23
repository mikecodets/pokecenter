import { Router } from "express";
import { AccountController } from "../../implementation/account/account.controller";
import { CustomerController } from "../../implementation/customer/customer.controller";
import { TransactionController } from "../../implementation/transaction/transaction.controller";

export class Routes {
	public firstVersion: Router;

	constructor() {
		this.firstVersion = Router();

		this.firstVersion.post("/customer", CustomerController.create);
		this.firstVersion.get("/customer/:customerId", CustomerController.find);
		this.firstVersion.get("/customer/", CustomerController.findAll);
		this.firstVersion.put("/customer/:customerId", CustomerController.update);
		this.firstVersion.delete(
			"/customer/:customerId",
			CustomerController.delete,
		);

		this.firstVersion.get("/balance/:customerId", AccountController.balance);

		this.firstVersion.post(
			"/transaction/deposit/:customerId",
			TransactionController.deposit,
		);
		this.firstVersion.post(
			"/transaction/withdraw/:customerId",
			TransactionController.withdraw,
		);
		this.firstVersion.post(
			"/transaction/transfer/:payingId/:receiverId",
			TransactionController.transfer,
		);
	}
}
