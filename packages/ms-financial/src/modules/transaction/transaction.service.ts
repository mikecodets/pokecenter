import { Transaction, TransactionOperation } from "@prisma/client";
import CustomerService from "@workspace/ms-customer";
import prisma from "../../../../shared/clients/prisma/client";
import { NotAcceptable } from "../../../../shared/middlewares/errors/usecases/not-acceptable";
import { AccountOperationEnum } from "../account/account.enum";
import AccountService from "../account/account.service";
import {
	Deposit,
	TransactionTransfer,
	Transfer,
	Withdraw,
} from "./transaction.domain";
import TransactionSchema from "./transaction.schema";

export default class TransactionService {
	private readonly transactionSchema: TransactionSchema;
	private readonly customerService: CustomerService;
	private readonly accountService: AccountService;

	constructor() {
		this.transactionSchema = new TransactionSchema();
		this.customerService = new CustomerService();
		this.accountService = new AccountService();
	}

	async deposit(data: Deposit): Promise<Transaction> {
		await this.transactionSchema.validateAmount(data.transaction.amount);

		const customer = await this.customerService.getById(data.customerId);

		const customerId = customer.id;
		const amount = data.transaction.amount;
		const type = AccountOperationEnum.INCREMENT;

		await this.accountService.updateBalance({ customerId, amount, type });

		return await prisma.transaction.create({
			data: {
				amount,
				methodPayment: data.transaction.methodPayment,
				operation: TransactionOperation.DEPOSIT,
				customerId,
			},
		});
	}

	async withdraw(data: Withdraw): Promise<Transaction> {
		await this.transactionSchema.validateAmount(data.transaction.amount);

		const customer = await this.customerService.getById(data.customerId);
		const account = await this.accountService.getBalance(customer.id);

		if (data.transaction.amount > account.balance) {
			throw new NotAcceptable(
				"The amount is greater than your account balance, please review your balance and redo the transaction",
			);
		}

		const customerId = customer.id;
		const amount = data.transaction.amount;
		const type = AccountOperationEnum.DECREMENT;

		await this.accountService.updateBalance({ customerId, amount, type });

		return await prisma.transaction.create({
			data: {
				amount,
				methodPayment: data.transaction.methodPayment,
				operation: TransactionOperation.WITHDRAW,
				customerId,
			},
		});
	}

	async transfer(data: Transfer): Promise<TransactionTransfer> {
		await this.transactionSchema.validateAmount(data.transaction.amount);

		if (data.payerId === data.receiverId) {
			throw new NotAcceptable("It is not possible to perform a self transfer");
		}

		const payer = await this.customerService.getById(data.payerId);
		const receiver = await this.customerService.getById(data.receiverId);

		const payerTransaction = await this.withdraw({
			customerId: payer.id,
			transaction: data.transaction,
		});

		const receiverTransaction = await this.deposit({
			customerId: receiver.id,
			transaction: data.transaction,
		});

		const payerAccount = await this.accountService.getBalance(payer.id);
		const receiverAccount = await this.accountService.getBalance(receiver.id);

		return {
			payer: {
				transaction: payerTransaction,
				account: payerAccount,
			},
			receiver: {
				transaction: receiverTransaction,
				account: receiverAccount,
			},
		};
	}
}
