import { FC } from "react";
import { Controller } from "react-hook-form";
import { DatePicker, IDatePickerProps, ITimePickerProps, TimePicker } from "@fluentui/react";
import * as React from "react";
import { IHookFormProps } from "../../Models/HookFormProps";
import { DateTimeService } from "../../services/DateTimeService";


export const ControlledTimePicker: FC<IHookFormProps & ITimePickerProps> = (
  props
) => {

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || ""}
      render={({
        field: { onBlur, name: fieldName, value },
        fieldState: { error }
      }) => {

        return (

          <TimePicker
            {...props}
            //allowFreeform={true}
            defaultValue={props.defaultValue}
            onChange={(event, date) => {
              props.onChange!(event, date);
            }}
            
            //defaultValue={ DateTimeService.FromGraphDateTime(value)}

            onBlur={onBlur}
          />
        )
      }}
    />
  );
};
