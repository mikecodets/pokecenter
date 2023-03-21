import { Account, Customer } from "@prisma/client";

export type CustomerWithAccount = Customer & {
	account: Account | null;
};
