import { Customer, PrismaClient } from "@prisma/client";
import prisma from "../../../../shared/clients/prisma/client";
import { NotAcceptable } from "../../../../shared/middlewares/errors/usecases/not-acceptable";
import { NotFound } from "../../../../shared/middlewares/errors/usecases/not-found";
import ObjectIdSchema from "../../../../shared/utils/object-id.schema";
import { CustomerWithAccount } from "./customer.domain";
import CustomerSchema from "./customer.schema";

export class CustomerService {
	private readonly prisma: PrismaClient;
	private readonly objectIdSchema: ObjectIdSchema;
	private readonly customerValidator: CustomerSchema;
	private readonly accountInclude = { account: true, transactions: true };

	constructor() {
		this.prisma = prisma;
		this.objectIdSchema = new ObjectIdSchema();
		this.customerValidator = new CustomerSchema();
	}

	async create(customer: Customer): Promise<Customer> {
		await this.customerValidator.validateName(customer.name);

		const existingCustomer = await this.prisma.customer.findUnique({
			where: { name: customer.name },
		});

		if (existingCustomer) {
			throw new NotAcceptable("This customer already exists in our system");
		}

		return await this.prisma.customer.create({
			data: {
				name: customer.name,
				phone: customer.phone,
				account: { create: { balance: 0 } },
			},
			include: this.accountInclude,
		});
	}

	async getById(customerId: string): Promise<CustomerWithAccount> {
		await this.objectIdSchema.validateObjectId(customerId);

		const customer = await this.prisma.customer.findUnique({
			where: { id: customerId },
			include: this.accountInclude,
		});

		if (!customer) {
			throw new NotFound("This customer does not exist in our system");
		}

		return customer;
	}

	async getAll(): Promise<Customer[]> {
		return await this.prisma.customer.findMany({
			include: this.accountInclude,
		});
	}

	async update(customerId: string, customer: Customer): Promise<Customer> {
		await this.customerValidator.validateName(customer.name);

		const { id } = await this.getById(customerId);

		return await this.prisma.customer.update({ where: { id }, data: customer });
	}

	async delete(customerId: string): Promise<void> {
		const customer = await this.getById(customerId);

		if (customer.account && customer.account.balance > 0) {
			throw new NotAcceptable(
				"This customer still has a positive balance and cannot be deleted. Please transfer the remaining balance or close the account first.",
			);
		}

		await this.prisma.customer.delete({
			where: { id: customer.id },
			include: { account: true },
		});
	}
}
