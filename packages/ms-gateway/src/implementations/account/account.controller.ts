import { Account } from "@prisma/client";
import AccountService from "@workspace/ms-financial/src/modules/account/account.service";
import { Request, Response } from "express";

export class AccountController {
	static async getBalance(request: Request, response: Response): Promise<Response<Account>> {
		const accountService = new AccountService();
		const account = await accountService.getBalance(request.params.customerId);

		return response.status(200).json({
			message: "🎉 balance retrieved successfully",
			data: account,
		});
	}
}
