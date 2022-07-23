import { faker } from "@faker-js/faker";
import {
	Account,
	Customer,
	Transaction,
	TransactionMethodPayment
} from "@prisma/client";

export class CustomerBuilder {
	private id: string;
	private name: string;
	private phone: string;
	private createdAt: Date;
	private updatedAt: Date;
	private accountId: string;
	private account: Account;

	constructor(account?: Account) {
		this.id = faker.database.mongodbObjectId().toString();
		this.name = faker.name.findName();
		this.phone = faker.phone.number();
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.accountId = account ? account.id : new AccountBuilder().build().id;
		this.account = account ? account : new AccountBuilder().build();
	}

	public build(): Customer & { account: Account } {
		return {
			id: this.id,
			name: this.name,
			phone: this.phone,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			accountId: this.accountId,
			account: this.account,
		};
	}
}

export class AccountBuilder {
	private id: string;
	private balance: number;
	private createdAt: Date;
	private updatedAt: Date;

	constructor(hasBalance?: boolean) {
		this.id = faker.database.mongodbObjectId().toString();
		this.balance = hasBalance
			? faker.datatype.float({ min: 100, max: 1000 })
			: 0;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	public build(): Account {
		return {
			id: this.id,
			balance: this.balance,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}

export class TransactionBuilder {
	private id: string;
	private amount: number;
	private methodPayment: TransactionMethodPayment;
	private createdAt: Date;
	private updatedAt: Date;
	private customerId: string;

	constructor(
		methodPayment: TransactionMethodPayment,
		customerId?: string,
		hasAmount?: boolean,
	) {
		this.id = faker.database.mongodbObjectId().toString();
		this.amount = hasAmount ? faker.datatype.float({ min: 100, max: 1000 }) : 0;
		this.methodPayment = methodPayment;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.customerId = customerId ?? faker.database.mongodbObjectId().toString();
	}

	public build(): Transaction {
		return {
			id: this.id,
			amount: this.amount,
			methodPayment: this.methodPayment,
			operation: "DEPOSIT",
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			customerId: this.customerId,
		};
	}
}
