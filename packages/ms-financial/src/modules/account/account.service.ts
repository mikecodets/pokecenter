import { Account } from "@prisma/client";
import { CustomerService } from "@workspace/ms-customer";
import objectid from "validate-objectid";
import { HttpErrorHandler } from "../../../../../shared/errors/httpErrorHandler";
import prisma from "../../client";
import { AccountOperationType } from "./account.enum";

export class AccountService {
	public static async balance(customerId: string): Promise<Account> {
		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		const { accountId } = await CustomerService.find(customerId);

		const hasAccount = await prisma.account.findUnique({
			where: {
				id: accountId,
			},
		});

		if (!hasAccount) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Customer does not have account",
					status: 404,
				}),
			);
		}

		return hasAccount;
	}

	public static async update(
		customerId: string,
		amount: number,
		type: AccountOperationType,
	): Promise<Account | undefined> {
		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		const { accountId } = await CustomerService.find(customerId);

		const hasAccount = await prisma.account.findUnique({
			where: {
				id: accountId,
			},
		});

		if (!hasAccount) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Customer does not have account",
					status: 404,
				}),
			);
		}

		const { INCREMENT, DECREMENT } = AccountOperationType;

		if (type === INCREMENT) {
			return await prisma.account.update({
				where: {
					id: hasAccount.id,
				},
				data: {
					balance: { increment: amount },
				},
			});
		} else if (type === DECREMENT) {
			return await prisma.account.update({
				where: {
					id: hasAccount.id,
				},
				data: {
					balance: { decrement: amount },
				},
			});
		}
	}
}
