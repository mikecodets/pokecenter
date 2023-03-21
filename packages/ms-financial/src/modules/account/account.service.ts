import { Account, PrismaClient } from "@prisma/client";
import CustomerService from "@workspace/ms-customer";
import prisma from "../../../../shared/clients/prisma/client";
import { NotFound } from "../../../../shared/middlewares/errors/usecases/not-found";

import { AccountUpdateData } from "./account.domain";
import { AccountOperationType } from "./account.enum";

export default class AccountService {
	private readonly prisma: PrismaClient;
	private readonly customerService: CustomerService;

	constructor() {
		this.prisma = prisma;
		this.customerService = new CustomerService();
	}

	async getBalance(customerId: string): Promise<Account> {
		const accountId = await this.getAccountId(customerId);

		const account = await this.prisma.account.findUnique({
			where: { id: accountId },
		});

		if (!account) {
			throw new NotFound("Account not found");
		}

		return account;
	}

	async updateBalance(
		customerId: string,
		amount: number,
		type: AccountOperationType,
	): Promise<Account> {
		const accountId = await this.getAccountId(customerId);

		const accountUpdateData: AccountUpdateData = {};

		if (type === AccountOperationType.INCREMENT) {
			accountUpdateData.increment = amount;
		} else if (type === AccountOperationType.DECREMENT) {
			accountUpdateData.decrement = amount;
		}

		const updatedAccount = await this.prisma.account.update({
			where: { id: accountId },
			data: { balance: accountUpdateData },
		});

		return updatedAccount;
	}

	private async getAccountId(customerId: string): Promise<string> {
		const customer = await this.customerService.getById(customerId);

		return customer.accountId;
	}
}
