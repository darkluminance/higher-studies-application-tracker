// Legacy FormModal (current component used by pages)
export { FormModal } from "./form-modal";

// New compound FormModal component
export { FormModal as CompoundFormModal, useFormModalContext } from "./form-modal/index";

// Form field components
export {
  FormField,
  TextInputField,
  TextAreaField,
  SelectField,
  CheckboxField,
} from "./form-field";
export {
  FieldWrapper,
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
  ValidatedCheckbox,
} from "./validated-fields";
export { PasswordInput, calculatePasswordStrength } from "./password-input";
export type { PasswordInputProps, PasswordStrength } from "./password-input";
export {
  FieldMessage,
  FieldError,
  FieldSuccess,
  FieldHint,
  FieldWrapperWithError,
} from "./field-error";
