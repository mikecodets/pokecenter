import { Customer } from "@prisma/client";
import { isEmpty } from "lodash";
import objectid from "validate-objectid";
import { HttpErrorHandler } from "../../../../../shared/errors/httpErrorHandler";
import prisma from "../../client";

export class CustomerService {
	public static async create(customer: Customer): Promise<Customer> {
		if (isEmpty(customer.name)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "The customer name field cannot be null",
					status: 400,
				}),
			);
		}

		const isCustomer = await prisma.customer.findUnique({
			where: {
				name: customer.name,
			},
		});

		if (isCustomer) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Customer already exists",
					status: 401,
				}),
			);
		}

		return await prisma.customer.create({
			data: {
				name: customer.name,
				phone: customer.phone,
				account: {
					create: {
						balance: 0,
					},
				},
			},
		});
	}

	public static async find(customerId: string): Promise<Customer> {
		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		const isCustomer = await prisma.customer.findUnique({
			where: {
				id: customerId,
			},
			include: {
				account: true,
				transactions: true,
			},
		});

		if (!isCustomer) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Customer does not exists",
					status: 404,
				}),
			);
		}

		return isCustomer;
	}

	public static async findAll(): Promise<Array<Customer>> {
		return await prisma.customer.findMany({
			include: {
				account: true,
				transactions: true,
			},
		});
	}

	public static async update(
		customerId: string,
		customer: Customer,
	): Promise<Customer> {
		if (isEmpty(customer.name)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "The customer name field cannot be null",
					status: 400,
				}),
			);
		}

		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		const isCustomer = await prisma.customer.findUnique({
			where: {
				id: customerId,
			},
		});

		if (!isCustomer) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Customer does not exists",
					status: 404,
				}),
			);
		}

		return await prisma.customer.update({
			where: {
				id: isCustomer.id,
			},
			data: customer,
		});
	}

	public static async delete(customerId: string): Promise<Customer> {
		if (!objectid(customerId)) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Error, expected a valid object-id",
					status: 400,
				}),
			);
		}

		const isCustomer = await prisma.customer.findUnique({
			where: {
				id: customerId,
			},
			include: {
				account: true,
			},
		});

		if (!isCustomer) {
			throw new Error(
				HttpErrorHandler.targetError({
					message: "Customer does not exists",
					status: 404,
				}),
			);
		}

		if (isCustomer.account && isCustomer.account.balance > 0) {
			throw new Error(
				HttpErrorHandler.targetError({
					message:
						"Customer has available balance, a transfer is still required for the transaction or account available",
					status: 401,
				}),
			);
		}

		return await prisma.customer.delete({
			where: {
				id: isCustomer.id,
			},
			include: {
				account: true,
			},
		});
	}
}
