import { faker } from "@faker-js/faker";
import { Account } from "@prisma/client";

export function accountGeneratorMock(): Account {
	const id = faker.database.mongodbObjectId();
	const balance = parseFloat(faker.finance.amount());
	const createdAt = faker.date.recent();
	const updatedAt = faker.date.recent();

	return { id, balance, createdAt, updatedAt };
}
