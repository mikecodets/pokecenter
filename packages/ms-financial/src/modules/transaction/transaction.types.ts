import { Account, Transaction } from "@prisma/client";

export type TransactionTransfer = {
	payer: {
		payerTransaction: Transaction;
		payerBalance: Account;
	};
	beneficiary: {
		beneficiaryTransaction: Transaction;
		beneficiaryBalance: Account;
	};
};
