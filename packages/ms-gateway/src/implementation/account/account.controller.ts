import { Account } from "@prisma/client";
import { AccountService } from "@workspace/ms-financial";
import { Request, Response } from "express";

export class AccountController {
	public static async balance(
		request: Request,
		response: Response,
	): Promise<Response<Account>> {
		const account = await AccountService.balance(request.params.customerId);

		return response.status(200).json({
			message: "Balance returned successfully",
			data: account,
		});
	}
}
