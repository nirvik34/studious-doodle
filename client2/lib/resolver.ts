import { z } from "zod";
import { FieldValues, Resolver } from "react-hook-form";

export const zodResolver = <T extends FieldValues>(schema: z.Schema<T>): Resolver<T> => async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
        return {
            values: result.data,
            errors: {},
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any = {};

    // Handle field errors
    const fieldErrors = result.error.formErrors.fieldErrors;
    for (const key in fieldErrors) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (fieldErrors as any)[key]?.[0];
        if (message) {
            errors[key] = {
                type: "validation",
                message,
            };
        }
    }

    return {
        values: {},
        errors,
    };
};
