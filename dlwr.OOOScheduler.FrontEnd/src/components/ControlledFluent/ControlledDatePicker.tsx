import { FC } from "react";
import { Controller } from "react-hook-form";
import { DatePicker, IDatePickerProps } from "@fluentui/react";
import { IHookFormProps } from "../../Models/HookFormProps";
import { DateTimeService } from "../../services/DateTimeService";


export const ControlledDatePicker: FC<IHookFormProps & IDatePickerProps> = (
  props
) => {
  
  return (
    <Controller  
    name={props.name}
    control={props.control}
    rules={props.rules}
    //defaultValue={props.defaultValue || ""}
    render={({
      field: { name: fieldName, value },
      fieldState: { error }
    }) => {
        console.log("hello", value);
          
        return (
          <DatePicker          
            {...props}
            textField={{
              name: fieldName,
              onChange: undefined,
              //onBlur,
              errorMessage: error && error.message
            }}
            onSelectDate={(date) => {
              props.onSelectDate!(date);
            }}
            value={DateTimeService.FromGraphDateTime(value.dateTime)}
            //onBlur={onBlur}
            defaultValue={undefined}
            onChange={undefined}
          />
        )
      }}
    />
  );
};
