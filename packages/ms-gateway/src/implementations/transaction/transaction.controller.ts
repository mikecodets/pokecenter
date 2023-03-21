import { Transaction } from "@prisma/client";
import { TransactionService, TransactionTransfer } from "@workspace/ms-financial";
import { Request, Response } from "express";
import { HttpErrorHandler } from "../../../../shared/middlewares/errors/http-error.handler";

export class TransactionController {
	static async deposit(request: Request, response: Response): Promise<Response<Transaction>> {
		try {
			const customerId = request.params.customerId;
			const depositData = request.body;
			const transactionService = new TransactionService();
			const transaction = await transactionService.deposit(customerId, depositData);

			return response.status(200).json({
				message: "🎉 deposit made successfully",
				data: transaction,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(status).json({
				error: { name, message, status },
			});
		}
	}

	static async withdraw(request: Request, response: Response): Promise<Response<Transaction>> {
		try {
			const customerId = request.params.customerId;
			const withdrawalData = request.body;
			const transactionService = new TransactionService();
			const transaction = await transactionService.withdraw(customerId, withdrawalData);

			return response.status(200).json({
				message: "🎉 withdrawal successful",
				data: transaction,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(status).json({
				error: { name, message, status },
			});
		}
	}

	static async transfer(request: Request, response: Response): Promise<Response<TransactionTransfer>> {
		try {
			const payingId = request.params.payingId;
			const receiverId = request.params.receiverId;
			const transferData = request.body;
			const transactionService = new TransactionService();
			const transaction = await transactionService.transfer(payingId, receiverId, transferData);

			return response.status(200).json({
				message: "🎉 transfer successful",
				data: transaction,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(status).json({
				error: { name, message, status },
			});
		}
	}
}
