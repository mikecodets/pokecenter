import { Account, Transaction } from "@prisma/client";

export type TransactionTransfer = {
	paying: {
		transaction: Transaction;
		account: Account;
	};
	beneficiary: {
		transaction: Transaction;
		account: Account;
	};
};
