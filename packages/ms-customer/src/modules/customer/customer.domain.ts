import { Account, Customer } from "@prisma/client";

export interface CustomerWithAccount extends Customer {
	account: Account | null;
}
