import * as yup from "yup";
import { NotAcceptable } from "../../../../shared/middlewares/errors/usecases/not-acceptable";

export default class TransactionSchema {
	private schema = yup.object().shape({
		amount: yup
			.number()
			.min(0.1, "The amount must be greater than or equal to R$ 0.1 cent to effect a transaction")
			.required(),
	});

	async validateAmount(amount: number) {
		await this.schema.validate({ amount }).catch((error) => {
			throw new NotAcceptable(error.message);
		});
	}
}
