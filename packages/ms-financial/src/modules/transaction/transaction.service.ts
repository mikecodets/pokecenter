import { Transaction, TransactionOperation } from "@prisma/client";
import CustomerService from "@workspace/ms-customer";
import prisma from "../../../../shared/clients/prisma/client";
import { NotAcceptable } from "../../../../shared/middlewares/errors/usecases/not-acceptable";
import { AccountOperationType } from "../account/account.enum";
import AccountService from "../account/account.service";
import { TransactionTransfer } from "./transaction.domain";
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

	async deposit(customerId: string, transaction: Transaction): Promise<Transaction> {
		await this.transactionSchema.validateAmount(transaction.amount);

		const customer = await this.customerService.getById(customerId);
		const id = customer.id;
		const amount = transaction.amount;
		const type = AccountOperationType.INCREMENT;

		await this.accountService.updateBalance(id, amount, type);

		return await prisma.transaction.create({
			data: {
				amount: transaction.amount,
				methodPayment: transaction.methodPayment,
				operation: TransactionOperation.DEPOSIT,
				customerId: customer.id,
			},
		});
	}

	async withdraw(customerId: string, transaction: Transaction): Promise<Transaction> {
		await this.transactionSchema.validateAmount(transaction.amount);

		const customer = await this.customerService.getById(customerId);
		const account = await this.accountService.getBalance(customer.id);

		if (transaction.amount > account.balance) {
			throw new NotAcceptable(
				"The amount is greater than your account balance, please review your balance and redo the transaction",
			);
		}

		const id = customer.id;
		const amount = transaction.amount;
		const type = AccountOperationType.DECREMENT;

		await this.accountService.updateBalance(id, amount, type);

		return await prisma.transaction.create({
			data: {
				amount: transaction.amount,
				methodPayment: transaction.methodPayment,
				operation: TransactionOperation.WITHDRAW,
				customerId: customer.id,
			},
		});
	}

	async transfer(payingId: string, beneficiaryId: string, transaction: Transaction): Promise<TransactionTransfer> {
		await this.transactionSchema.validateAmount(transaction.amount);

		if (payingId === beneficiaryId) {
			throw new NotAcceptable("It is not possible to perform a self transfer");
		}

		const paying = await this.customerService.getById(payingId);
		const beneficiary = await this.customerService.getById(beneficiaryId);

		const payerTransaction = await this.withdraw(paying.id, transaction);
		const beneficiaryTransaction = await this.deposit(beneficiary.id, transaction);

		const payerBalance = await this.accountService.getBalance(paying.id);
		const beneficiaryBalance = await this.accountService.getBalance(beneficiary.id);

		return {
			payer: { payerTransaction, payerBalance },
			beneficiary: { beneficiaryTransaction, beneficiaryBalance },
		};
	}
}
