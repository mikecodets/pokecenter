import { Account, Transaction } from "@prisma/client";

export interface Deposit {
	customerId: string;
	transaction: Transaction;
}

export interface Withdraw {
	customerId: string;
	transaction: Transaction;
}

export interface Transfer {
	payerId: string;
	receiverId: string;
	transaction: Transaction;
}

export interface TransactionTransfer {
	payer: {
		transaction: Transaction;
		account: Account;
	};
	receiver: {
		transaction: Transaction;
		account: Account;
	};
}
