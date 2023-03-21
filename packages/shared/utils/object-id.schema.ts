import * as Yup from "yup";
import { NotAcceptable } from "../middlewares/errors/usecases/not-acceptable";

export default class ObjectIdSchema {
	private schema = Yup.object().shape({
		id: Yup.string()
			.matches(/^[0-9a-fA-F]{24}$/, "Error, expected a valid object-id")
			.required("Error, expected a valid object-id"),
	});

	async validateObjectId(id: string | null | undefined) {
		await this.schema.validate({ id }).catch((error) => {
			throw new NotAcceptable(error.message);
		});
	}
}
