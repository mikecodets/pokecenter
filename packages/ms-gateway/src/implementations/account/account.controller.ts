import { Account } from "@prisma/client";
import AccountService from "@workspace/ms-financial/src/modules/account/account.service";
import { Request, Response } from "express";
import { HttpErrorHandler } from "../../../../shared/middlewares/errors/http-error.handler";

export class AccountController {
	static async getBalance(request: Request, response: Response): Promise<Response<Account>> {
		try {
			const accountService = new AccountService();
			const account = await accountService.getBalance(request.params.customerId);

			return response.status(200).json({
				message: "🎉 balance retrieved successfully",
				data: account,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(status).json({
				error: { name, message, status },
			});
		}
	}
}
