import { Transaction } from "@prisma/client";
import {
	TransactionService,
	TransactionTransfer
} from "@workspace/ms-financial";
import { Request, Response } from "express";

export class TransactionController {
	public static async deposit(
		request: Request,
		response: Response,
	): Promise<Response<Transaction>> {
		const transaction = await TransactionService.deposit(
			request.params.customerId,
			request.body,
		);

		return response.status(200).json({
			message: "Deposit made successfully",
			data: transaction,
		});
	}

	public static async withdraw(
		request: Request,
		response: Response,
	): Promise<Response<Transaction>> {
		const transaction = await TransactionService.withdraw(
			request.params.customerId,
			request.body,
		);

		return response.status(200).json({
			message: "Withdrawal successful",
			data: transaction,
		});
	}

	public static async transfer(
		request: Request,
		response: Response,
	): Promise<Response<TransactionTransfer>> {
		const transaction = await TransactionService.transfer(
			request.params.payingId,
			request.params.receiverId,
			request.body,
		);

		return response.status(200).json({
			message: "Transfer successful",
			data: transaction,
		});
	}
}
