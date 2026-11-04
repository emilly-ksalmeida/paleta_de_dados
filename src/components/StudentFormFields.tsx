import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  REQUIRED_FIELD_NAMES,
  STUDENT_FORM_SECTIONS,
} from "@/lib/studentForm/studentFormConfig";
import type { StudentFormValues } from "@/schemas/studentFormSchema";

interface StudentFormFieldsProps {
  register: UseFormRegister<StudentFormValues>;
  control: Control<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  idPrefix: string;
}

export function StudentFormFields({
  register,
  control,
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
            <FieldGroup className="flex flex-wrap gap-4">
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
                const radioOptions = field.radioOptions ?? [];
                const isRadio = radioOptions.length > 0;

                return (
                  <Field
                    key={field.name}
                    data-invalid={fieldError ? true : undefined}
                    className={
                      field.multiline || isRadio
                        ? "w-full"
                        : "w-full md:w-[calc(50%-0.5rem)]"
                    }
                  >
                    {isRadio ? (
                      <>
                        <FieldLabel id={`${fieldId}-label`}>
                          {field.label}
                          {isRequired ? (
                            <span
                              aria-hidden="true"
                              className="text-destructive"
                            >
                              *
                            </span>
                          ) : null}
                        </FieldLabel>
                        {field.description ? (
                          <FieldDescription id={descriptionId}>
                            {field.description}
                          </FieldDescription>
                        ) : null}
                        <Controller
                          control={control}
                          name={field.name}
                          render={({ field: controllerField }) => (
                            <RadioGroup
                              ref={controllerField.ref}
                              name={controllerField.name}
                              value={controllerField.value ?? ""}
                              onValueChange={controllerField.onChange}
                              onBlur={controllerField.onBlur}
                              aria-labelledby={`${fieldId}-label`}
                              aria-invalid={fieldError ? true : undefined}
                              aria-describedby={describedBy}
                              className="flex flex-col gap-3"
                            >
                              {radioOptions.map((option, optionIndex) => {
                                const optionId = `${fieldId}-option-${optionIndex}`;

                                return (
                                  <div
                                    key={option.value}
                                    className="flex items-center gap-2"
                                  >
                                    <RadioGroupItem
                                      id={optionId}
                                      value={option.value}
                                    />
                                    <Label htmlFor={optionId}>
                                      {option.label}
                                    </Label>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                          )}
                        />
                        <FieldError
                          id={errorId}
                          errors={fieldError ? [fieldError] : undefined}
                        />
                      </>
                    ) : (
                      <>
                        <FieldLabel htmlFor={fieldId}>
                          {field.label}
                          {isRequired ? (
                            <span
                              aria-hidden="true"
                              className="text-destructive"
                            >
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
                      </>
                    )}
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
