import { Customer } from "@prisma/client";
import CustomerService from "@workspace/ms-customer";
import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status";
import { HttpErrorHandler } from "../../../../shared/middlewares/errors/http-error.handler";

export class CustomerController {
	static async create(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		try {
			const customerService = new CustomerService();
			const customer = await customerService.create(request.body);

			return response.status(201).json({
				message: "🎉 customer created successfully.",
				data: customer,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(INTERNAL_SERVER_ERROR).json({
				error: { name, message, status },
			});
		}
	}

	static async getById(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		try {
			const customerService = new CustomerService();
			const customer = await customerService.getById(request.params.customerId);

			return response.status(200).json({
				message: "🎉 customer found successfully.",
				data: customer,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(INTERNAL_SERVER_ERROR).json({
				error: { name, message, status },
			});
		}
	}

	static async getAll(
		request: Request,
		response: Response,
	): Promise<Response<Customer[]>> {
		try {
			const customerService = new CustomerService();
			const customers = await customerService.getAll();

			return response.status(200).json({
				message: "🎉 customers found successfully.",
				data: customers,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(INTERNAL_SERVER_ERROR).json({
				error: { name, message, status },
			});
		}
	}

	static async update(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		try {
			const customerService = new CustomerService();
			const customer = await customerService.update(
				request.params.customerId,
				request.body,
			);

			return response.status(200).json({
				message: "🎉 customer updated successfully.",
				data: customer,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(INTERNAL_SERVER_ERROR).json({
				error: { name, message, status },
			});
		}
	}

	static async delete(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		try {
			const customerService = new CustomerService();
			const customer = await customerService.delete(request.params.customerId);

			return response.status(200).json({
				message: "🎉 customer deleted successfully.",
				data: customer,
			});
		} catch (error) {
			const { name, message, status } = error as unknown as HttpErrorHandler;
			return response.status(INTERNAL_SERVER_ERROR).json({
				error: { name, message, status },
			});
		}
	}
}
