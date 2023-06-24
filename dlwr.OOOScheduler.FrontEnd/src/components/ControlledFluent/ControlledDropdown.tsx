import { FC, useState } from "react";
import { IHookFormProps } from "../../Models/HookFormProps";
import { Dropdown, IDropdownProps } from "@fluentui/react";
import { Controller } from "react-hook-form";

// use default as selecter but make sure your key is the right type eg if you have options that are numbers use a number as a value else you won't select the right option
export const ControlledDropdown: FC<IHookFormProps & IDropdownProps> = (
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
            
            <Dropdown
              {...props}
              onChange={(event, date) => {
                props.onChange!(event, date);
              }}
              defaultSelectedKey={value ? value : -1}
              //selectedKey={key ? key : -1}
              onBlur={onBlur}
            />
          )
        }}
      />
    );
  };
  