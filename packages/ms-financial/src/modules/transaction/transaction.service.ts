import { Transaction, TransactionOperation } from "@prisma/client";
import { CustomerService } from "@workspace/ms-customer";
import objectid from "validate-objectid";
import { HttpErrorHandler } from "../../../../../shared/errors/httpErrorHandler";
import prisma from "../../client";
import { AccountOperationType } from "../account/account.enum";
import { AccountService } from "../account/account.service";
import { TransactionTransfer } from "./transaction.types";

export class TransactionService {
	public static async deposit(
		customerId: string,
		transaction: Transaction,
	): Promise<Transaction> {
		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		if (transaction.amount <= 0) {
			throw new Error(
				HttpErrorHandler.targetError({
					message:
						"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
					status: 400,
				}),
			);
		}

		const customer = await CustomerService.find(customerId);

		const { INCREMENT } = AccountOperationType;

		await AccountService.update(customer.id, transaction.amount, INCREMENT);

		const { DEPOSIT } = TransactionOperation;

		return await prisma.transaction.create({
			data: {
				amount: transaction.amount,
				methodPayment: transaction.methodPayment,
				operation: DEPOSIT,
				customerId: customer.id,
			},
		});
	}

	public static async withdraw(
		customerId: string,
		transaction: Transaction,
	): Promise<Transaction> {
		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		if (transaction.amount <= 0) {
			throw new Error(
				HttpErrorHandler.targetError({
					message:
						"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
					status: 400,
				}),
			);
		}

		const customer = await CustomerService.find(customerId);
		const account = await AccountService.balance(customer.id);

		if (transaction.amount > account.balance) {
			throw new Error(
				HttpErrorHandler.targetError({
					message:
						"The amount is greater than your account balance, please review your balance and redo the transaction",
					status: 400,
				}),
			);
		}

		const { DECREMENT } = AccountOperationType;

		await AccountService.update(customer.id, transaction.amount, DECREMENT);

		const { WITHDRAW } = TransactionOperation;

		return await prisma.transaction.create({
			data: {
				amount: transaction.amount,
				methodPayment: transaction.methodPayment,
				operation: WITHDRAW,
				customerId: customer.id,
			},
		});
	}

	public static async transfer(
		payingId: string,
		beneficiaryId: string,
		transaction: Transaction,
	): Promise<TransactionTransfer> {
		if (!objectid(payingId) || !objectid(beneficiaryId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		if (transaction.amount <= 0) {
			throw new Error(
				HttpErrorHandler.targetError({
					message:
						"The amount must be greater than or equal to R$ 0.1 cent to effect a transaction",
					status: 400,
				}),
			);
		}

		const paying = await CustomerService.find(payingId);
		const beneficiary = await CustomerService.find(beneficiaryId);

		const payerTransaction = await TransactionService.withdraw(
			paying.id,
			transaction,
		);

		const beneficiaryTransaction = await TransactionService.deposit(
			beneficiary.id,
			transaction,
		);

		const payerBalance = await AccountService.balance(paying.id);
		const beneficiaryBalance = await AccountService.balance(beneficiary.id);

		return {
			payer: {
				payerTransaction,
				payerBalance,
			},
			beneficiary: {
				beneficiaryTransaction,
				beneficiaryBalance,
			},
		};
	}
}
