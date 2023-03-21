import { faker } from "@faker-js/faker";

export function customerGeneratorMock(nullableName?: boolean) {
	const id = faker.database.mongodbObjectId();
	const name = nullableName ? "" : faker.name.fullName();
	const phone = faker.phone.number();
	const createdAt = faker.date.recent();
	const updatedAt = faker.date.recent();
	const accountId = faker.datatype.uuid();

	return { id, name, phone, createdAt, updatedAt, accountId };
}

export function customersGeneratorMock() {
	return [...Array(5)].map(() => customerGeneratorMock());
}
