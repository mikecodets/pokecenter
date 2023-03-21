import * as Yup from "yup";
import { NotAcceptable } from "../../../../shared/middlewares/errors/usecases/not-acceptable";

export default class CustomerSchema {
	private schema = Yup.object().shape({
		name: Yup.string().required("The customer name field cannot be null"),
	});

	async validateName(name: string | null | undefined): Promise<void> {
		await this.schema.validate({ name }).catch((error) => {
			throw new NotAcceptable(error.message);
		});
	}
}
