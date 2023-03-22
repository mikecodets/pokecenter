import { AccountOperationEnum } from "./account.enum";

export interface AccountUpdateData {
	increment?: number;
	decrement?: number;
}

export interface UpdateBalance {
	customerId: string;
	amount: number;
	type: AccountOperationEnum;
}
