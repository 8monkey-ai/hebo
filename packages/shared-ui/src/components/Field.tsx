import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type FieldMetadata } from "@conform-to/react";
import * as React from "react";

import {
  Field as ShadCnField,
  FieldLabel as ShadCnFieldLabel,
  FieldDescription as ShadCnFieldDescription,
  FieldError as ShadCnFieldError,
  FieldGroup as ShadCnFieldGroup,
} from "#/_shadcn/ui/field";
import { cn } from "#/lib/utils";

const FieldCtx = React.createContext<FieldMetadata<string> | undefined>(
  undefined,
);
const useField = () => {
  const f = React.useContext(FieldCtx);
  if (!f)
    console.warn(
      "Use <FieldLabel/FieldControl/FieldDescription/FieldMessage> inside <Field>.",
    );
  return f;
};

function Field({
  field,
  className,
  ...props
}: React.ComponentProps<typeof ShadCnField> & {
  field: FieldMetadata<string>;
}) {
  return (
    <FieldCtx.Provider value={field}>
      <ShadCnField
        className={cn(
          "gap-2 @md/field-group:[&>[data-slot=field-label]]:flex-initial @md/field-group:[&>[data-slot=field-label]]:min-w-32",
          className,
        )}
        {...props}
      />
    </FieldCtx.Provider>
  );
}

function FieldLabel({
  ...props
}: React.ComponentProps<typeof ShadCnFieldLabel>) {
  const field = useField();

  return (
    <ShadCnFieldLabel
      data-error={!field?.valid}
      htmlFor={field?.id}
      {...props}
    />
  );
}

function FieldDescription({
  ...props
}: React.ComponentProps<typeof ShadCnFieldDescription>) {
  const field = useField();

  return <ShadCnFieldDescription id={field?.descriptionId} {...props} />;
}

function FieldError() {
  const field = useField();
  const errorsDict = field?.errors?.map((message) => ({ message }));

  return <ShadCnFieldError id={field?.errorId} errors={errorsDict} />;
}

function FieldGroup({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnFieldGroup>) {
  return <ShadCnFieldGroup className={cn("gap-4", className)} {...props} />;
}

function FieldControl({ render, ...props }: useRender.ComponentProps<"input">) {
  const field = useField();

  return useRender({
    defaultTagName: "input",
    props: mergeProps<"input">(
      {
        id: field?.id,
        name: field?.name,
        defaultValue: field?.initialValue,
        "aria-describedby": field?.valid
          ? `${field?.descriptionId}`
          : `${field?.errorId}`,
        "aria-invalid": !field?.valid,
      },
      props,
    ),
    render,
  });
}

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
};

export {
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "#/_shadcn/ui/field";
