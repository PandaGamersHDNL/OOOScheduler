import { Control, RegisterOptions, UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface IHookFormProps {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  defaultValue?: any;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
}
