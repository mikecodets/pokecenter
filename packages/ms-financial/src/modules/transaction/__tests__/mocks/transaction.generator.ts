import { faker } from "@faker-js/faker";
import { Transaction, TransactionMethodPayment, TransactionOperation } from "@prisma/client";

export function transactionGeneratorMock(): Transaction {
	const transactionMethodPayment = Object.values(TransactionMethodPayment);
	const transactionOperation = Object.values(TransactionOperation);

	const id = faker.database.mongodbObjectId();
	const amount = faker.datatype.number({ min: 100, max: 1000 });
	const methodPayment = faker.helpers.arrayElement(transactionMethodPayment);
	const operation = faker.helpers.arrayElement(transactionOperation);
	const createdAt = faker.date.between("2021-01-01", "2023-03-20");
	const updatedAt = faker.date.between(createdAt, "2023-03-20");
	const customerId = faker.database.mongodbObjectId();

	return {
		id,
		amount,
		methodPayment,
		operation,
		createdAt,
		updatedAt,
		customerId,
	};
}
