import { FC } from "react";
import { Controller } from "react-hook-form";
import * as React from "react";
import { IHookFormProps } from "../../Models/HookFormProps";
import { ITextFieldProps, TextField } from "@fluentui/react";

//https://codesandbox.io/s/full-sample-7-qrrn6?from-embed=&file=/src/fluent-rhf/ControlledDatePicker.tsx
export const ControlledTextField: FC<IHookFormProps & ITextFieldProps> = (
  props
  ) => {
    return (
      <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || ""}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => {
        
        return <TextField
        {...props}
        value={value}
        onChange={ props.onChange ? props.onChange : onChange }
        onBlur={onBlur}
        name={fieldName}
        errorMessage={error && error.message}
        //defaultValue={undefined}
          />
      }}
    />
  );
};
