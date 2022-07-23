import { Customer } from "@prisma/client";
import { CustomerService } from "@workspace/ms-customer";
import { Request, Response } from "express";

export class CustomerController {
	public static async create(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		const customer = await CustomerService.create(request.body);

		return response.status(201).json({
			message: "Customer created successfully",
			data: customer,
		});
	}

	public static async find(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		const customer = await CustomerService.find(request.params.customerId);

		return response.status(200).json({
			message: "Customer successfully found",
			data: customer,
		});
	}

	public static async findAll(
		request: Request,
		response: Response,
	): Promise<Response<Array<Customer>>> {
		const customers = await CustomerService.findAll();

		return response.status(200).json({
			message: "Customers successfully found",
			data: customers,
		});
	}

	public static async update(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		const customer = await CustomerService.update(
			request.params.customerId,
			request.body,
		);

		return response.status(200).json({
			message: "Customer successfully updated",
			data: customer,
		});
	}

	public static async delete(
		request: Request,
		response: Response,
	): Promise<Response<Customer>> {
		const customer = await CustomerService.delete(request.params.customerId);

		return response.status(200).json({
			message: "Customer successfully deleted",
			data: customer,
		});
	}
}
