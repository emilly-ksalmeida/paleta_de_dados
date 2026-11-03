import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  REQUIRED_FIELD_NAMES,
  STUDENT_FORM_SECTIONS,
} from "@/lib/studentForm/studentFormConfig";
import type { StudentFormValues } from "@/schemas/studentFormSchema";

interface StudentFormFieldsProps {
  register: UseFormRegister<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  idPrefix: string;
}

export function StudentFormFields({
  register,
  errors,
  idPrefix,
}: StudentFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6 pb-2">
      {STUDENT_FORM_SECTIONS.map((section, sectionIndex) => (
        <div key={section.title} className="flex flex-col gap-6">
          {sectionIndex > 0 ? <FieldSeparator /> : null}
          <FieldSet>
            <FieldLegend>{section.title}</FieldLegend>
            {section.description ? (
              <FieldDescription>{section.description}</FieldDescription>
            ) : null}
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.fields.map((field) => {
                const fieldError = errors[field.name];
                const fieldId = `${idPrefix}-${field.name}`;
                const descriptionId = field.description
                  ? `${fieldId}-description`
                  : undefined;
                const errorId = fieldError ? `${fieldId}-error` : undefined;
                const describedBy =
                  [descriptionId, errorId].filter(Boolean).join(" ") ||
                  undefined;
                const isRequired = REQUIRED_FIELD_NAMES.has(field.name);

                return (
                  <Field
                    key={field.name}
                    data-invalid={fieldError ? true : undefined}
                    className={field.multiline ? "md:col-span-2" : undefined}
                  >
                    <FieldLabel htmlFor={fieldId}>
                      {field.label}
                      {isRequired ? (
                        <span aria-hidden="true" className="text-destructive">
                          *
                        </span>
                      ) : null}
                    </FieldLabel>
                    {field.multiline ? (
                      <Textarea
                        id={fieldId}
                        rows={3}
                        aria-invalid={fieldError ? true : undefined}
                        aria-required={isRequired ? true : undefined}
                        aria-describedby={describedBy}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                      />
                    ) : (
                      <Input
                        id={fieldId}
                        aria-invalid={fieldError ? true : undefined}
                        aria-required={isRequired ? true : undefined}
                        aria-describedby={describedBy}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                      />
                    )}
                    {field.description ? (
                      <FieldDescription id={descriptionId}>
                        {field.description}
                      </FieldDescription>
                    ) : null}
                    <FieldError
                      id={errorId}
                      errors={fieldError ? [fieldError] : undefined}
                    />
                  </Field>
                );
              })}
            </FieldGroup>
          </FieldSet>
        </div>
      ))}
    </div>
  );
}
