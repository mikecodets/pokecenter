import { Customer } from "@prisma/client";
import CustomerService from "@workspace/ms-customer";
import { Request, Response } from "express";

export class CustomerController {
	static async create(request: Request, response: Response): Promise<Response<Customer>> {
		const customerService = new CustomerService();
		const customer = await customerService.create(request.body);

		return response.status(201).json({
			message: "🎉 customer created successfully.",
			data: customer,
		});
	}

	static async getById(request: Request, response: Response): Promise<Response<Customer>> {
		const customerService = new CustomerService();
		const customer = await customerService.getById(request.params.customerId);

		return response.status(200).json({
			message: "🎉 customer found successfully.",
			data: customer,
		});
	}

	static async getAll(request: Request, response: Response): Promise<Response<Customer[]>> {
		const customerService = new CustomerService();
		const customers = await customerService.getAll();

		return response.status(200).json({
			message: "🎉 customers found successfully.",
			data: customers,
		});
	}

	static async update(request: Request, response: Response): Promise<Response<Customer>> {
		const customerService = new CustomerService();
		const customer = await customerService.update(request.params.customerId, request.body);

		return response.status(200).json({
			message: "🎉 customer updated successfully.",
			data: customer,
		});
	}

	static async delete(request: Request, response: Response): Promise<Response<Customer>> {
		const customerService = new CustomerService();
		const customer = await customerService.delete(request.params.customerId);

		return response.status(200).json({
			message: "🎉 customer deleted successfully.",
			data: customer,
		});
	}
}
