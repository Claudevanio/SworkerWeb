import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { PropsWithChildren } from "react";

interface FormProps<T extends FieldValues>
    extends PropsWithChildren{ 
    onSubmit: SubmitHandler<FieldValues>;
    className?: string;
}

export function Form<T extends FieldValues>({ 
    onSubmit,
    children,
    ...rest
}: FormProps<T>) {
    return (
        <FormProvider {...rest as any}>
            <form onSubmit={(rest as any).handleSubmit(onSubmit)} {...rest}>
                {children}
            </form>
        </FormProvider>
    );
}